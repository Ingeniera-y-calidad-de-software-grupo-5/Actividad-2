import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settlement, SettlementStatus } from './entities/settlement.entity';
import { Group } from '../groups/entities/group.entity';
import { User } from '../users/entities/user.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import {
  DebtSettlementSuggestionDto,
  GroupBalanceSummaryDto,
  UserBalanceDto,
} from './dto/balance-summary.dto';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private readonly splitRepository: Repository<ExpenseSplit>,
  ) {}

  async getGroupBalances(groupId: string): Promise<GroupBalanceSummaryDto> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['members', 'members.user'],
    });

    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    const expenses = await this.expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['paidBy', 'splits', 'splits.user'],
    });

    const settlements = await this.settlementRepository.find({
      where: { group: { id: groupId }, status: SettlementStatus.COMPLETED },
      relations: ['payer', 'receiver'],
    });

    // Mapeo de miembros
    const memberMap = new Map<
      string,
      {
        user: User;
        totalPaid: number;
        totalOwed: number;
        settlementsPaid: number;
        settlementsReceived: number;
      }
    >();

    for (const gm of group.members) {
      memberMap.set(gm.user.id, {
        user: gm.user,
        totalPaid: 0,
        totalOwed: 0,
        settlementsPaid: 0,
        settlementsReceived: 0,
      });
    }

    let totalGroupSpending = 0;

    for (const exp of expenses) {
      const expAmount = Number(exp.amount);
      totalGroupSpending += expAmount;

      // Sumar al pagador
      if (memberMap.has(exp.paidBy.id)) {
        memberMap.get(exp.paidBy.id)!.totalPaid += expAmount;
      }

      // Sumar splits asignados
      if (exp.splits) {
        for (const sp of exp.splits) {
          const splitAmount = Number(sp.amount);
          if (memberMap.has(sp.user.id)) {
            memberMap.get(sp.user.id)!.totalOwed += splitAmount;
          }
        }
      }
    }

    // Procesar liquidaciones
    for (const st of settlements) {
      const stAmount = Number(st.amount);
      if (memberMap.has(st.payer.id)) {
        memberMap.get(st.payer.id)!.settlementsPaid += stAmount;
      }
      if (memberMap.has(st.receiver.id)) {
        memberMap.get(st.receiver.id)!.settlementsReceived += stAmount;
      }
    }

    const memberBalances: UserBalanceDto[] = [];
    for (const [, item] of memberMap) {
      const net =
        item.totalPaid - item.totalOwed + (item.settlementsPaid - item.settlementsReceived);
      memberBalances.push({
        user: item.user,
        totalPaid: Number(item.totalPaid.toFixed(2)),
        totalOwed: Number(item.totalOwed.toFixed(2)),
        settlementsPaid: Number(item.settlementsPaid.toFixed(2)),
        settlementsReceived: Number(item.settlementsReceived.toFixed(2)),
        netBalance: Number(net.toFixed(2)),
      });
    }

    // Algoritmo Min Cash Flow / Greedy Debt Settlement
    const suggestedSettlements = this.calculateSimplifiedDebts(memberBalances);

    return {
      groupId,
      totalGroupSpending: Number(totalGroupSpending.toFixed(2)),
      memberBalances,
      suggestedSettlements,
    };
  }

  /**
   * Algoritmo de resolución de deudas mínimas (Greedy Cash Flow Simplification)
   */
  private calculateSimplifiedDebts(balances: UserBalanceDto[]): DebtSettlementSuggestionDto[] {
    // Clonar para no mutar los originales
    const netAmounts = balances.map((b) => ({
      user: b.user,
      balance: Math.round(b.netBalance * 100) / 100,
    }));

    const suggestions: DebtSettlementSuggestionDto[] = [];

    while (true) {
      // Ordenar: deudor más negativo primero, acreedor más positivo al final
      netAmounts.sort((a, b) => a.balance - b.balance);

      const maxDebtor = netAmounts[0];
      const maxCreditor = netAmounts[netAmounts.length - 1];

      // Si las diferencias son residuales (< 0.01), terminamos
      if (
        !maxDebtor ||
        !maxCreditor ||
        maxDebtor.balance >= -0.005 ||
        maxCreditor.balance <= 0.005
      ) {
        break;
      }

      // Monto a transferir: mínimo entre lo que debe y lo que espera cobrar
      const debtAbs = Math.abs(maxDebtor.balance);
      const credit = maxCreditor.balance;
      const transferAmount = Math.round(Math.min(debtAbs, credit) * 100) / 100;

      if (transferAmount > 0) {
        suggestions.push({
          fromUser: maxDebtor.user,
          toUser: maxCreditor.user,
          amount: transferAmount,
        });

        // Actualizar balances
        maxDebtor.balance = Math.round((maxDebtor.balance + transferAmount) * 100) / 100;
        maxCreditor.balance = Math.round((maxCreditor.balance - transferAmount) * 100) / 100;
      } else {
        break;
      }
    }

    return suggestions;
  }

  async createSettlement(
    groupId: string,
    createSettlementDto: CreateSettlementDto,
  ): Promise<Settlement> {
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    if (createSettlementDto.payerId === createSettlementDto.receiverId) {
      throw new BadRequestException('El pagador y el receptor no pueden ser la misma persona');
    }

    const payer = await this.userRepository.findOne({
      where: { id: createSettlementDto.payerId },
    });
    if (!payer) {
      throw new NotFoundException(`Usuario deudor con ID ${createSettlementDto.payerId} no encontrado`);
    }

    const receiver = await this.userRepository.findOne({
      where: { id: createSettlementDto.receiverId },
    });
    if (!receiver) {
      throw new NotFoundException(`Usuario acreedor con ID ${createSettlementDto.receiverId} no encontrado`);
    }

    const settlement = this.settlementRepository.create({
      group,
      payer,
      receiver,
      amount: Number(createSettlementDto.amount),
      status: SettlementStatus.COMPLETED,
    });

    return await this.settlementRepository.save(settlement);
  }

  async getSettlementsByGroup(groupId: string): Promise<Settlement[]> {
    return await this.settlementRepository.find({
      where: { group: { id: groupId } },
      relations: ['payer', 'receiver'],
      order: { createdAt: 'DESC' },
    });
  }
}
