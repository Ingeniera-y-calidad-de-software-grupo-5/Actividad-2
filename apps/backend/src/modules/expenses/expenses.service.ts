import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense, ExpenseCategory, SplitType } from './entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';
import { Group } from '../groups/entities/group.entity';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private readonly splitRepository: Repository<ExpenseSplit>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(groupId: string, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['members', 'members.user'],
    });

    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    const payer = await this.userRepository.findOne({ where: { id: createExpenseDto.paidById } });
    if (!payer) {
      throw new NotFoundException(`Usuario pagador con ID ${createExpenseDto.paidById} no encontrado`);
    }

    const totalAmount = Number(createExpenseDto.amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      throw new BadRequestException('El monto del gasto debe ser un número positivo');
    }

    const splitType = createExpenseDto.splitType || SplitType.EQUAL;
    const splitsToCreate: { user: User; amount: number; percentage: number }[] = [];

    if (splitType === SplitType.EQUAL) {
      let targetUserIds = createExpenseDto.participantIds;
      if (!targetUserIds || targetUserIds.length === 0) {
        targetUserIds = group.members.map((m) => m.user.id);
      }

      if (targetUserIds.length === 0) {
        throw new BadRequestException('El grupo no posee participantes para dividir el gasto');
      }

      const count = targetUserIds.length;
      const baseSplit = Math.floor((totalAmount / count) * 100) / 100;
      let remainder = Number((totalAmount - baseSplit * count).toFixed(2));

      for (let i = 0; i < count; i++) {
        const userId = targetUserIds[i];
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException(`Participante con ID ${userId} no encontrado`);
        }

        let assignedAmount = baseSplit;
        if (remainder > 0.001) {
          assignedAmount = Number((assignedAmount + 0.01).toFixed(2));
          remainder = Number((remainder - 0.01).toFixed(2));
        }

        const percentage = Number(((assignedAmount / totalAmount) * 100).toFixed(2));
        splitsToCreate.push({ user, amount: assignedAmount, percentage });
      }
    } else if (splitType === SplitType.EXACT) {
      if (!createExpenseDto.customSplits || createExpenseDto.customSplits.length === 0) {
        throw new BadRequestException('Debe especificar customSplits para la modalidad EXACT');
      }

      let sumExact = 0;
      for (const item of createExpenseDto.customSplits) {
        const user = await this.userRepository.findOne({ where: { id: item.userId } });
        if (!user) {
          throw new NotFoundException(`Participante con ID ${item.userId} no encontrado`);
        }
        const itemAmount = Number(item.amount || 0);
        sumExact += itemAmount;
        const percentage = Number(((itemAmount / totalAmount) * 100).toFixed(2));
        splitsToCreate.push({ user, amount: itemAmount, percentage });
      }

      if (Math.abs(sumExact - totalAmount) > 0.05) {
        throw new BadRequestException(
          `La suma de los montos (${sumExact}) no coincide con el total del gasto (${totalAmount})`,
        );
      }
    } else if (splitType === SplitType.PERCENTAGE) {
      if (!createExpenseDto.customSplits || createExpenseDto.customSplits.length === 0) {
        throw new BadRequestException('Debe especificar customSplits para la modalidad PERCENTAGE');
      }

      let sumPercent = 0;
      for (const item of createExpenseDto.customSplits) {
        const user = await this.userRepository.findOne({ where: { id: item.userId } });
        if (!user) {
          throw new NotFoundException(`Participante con ID ${item.userId} no encontrado`);
        }
        const percent = Number(item.percentage || 0);
        sumPercent += percent;
        const assignedAmount = Number(((totalAmount * percent) / 100).toFixed(2));
        splitsToCreate.push({ user, amount: assignedAmount, percentage: percent });
      }

      if (Math.abs(sumPercent - 100) > 0.1) {
        throw new BadRequestException(
          `La suma de porcentajes (${sumPercent}%) debe ser exactamente 100%`,
        );
      }
    }

    const expense = this.expenseRepository.create({
      group,
      paidBy: payer,
      description: createExpenseDto.description,
      amount: totalAmount,
      category: createExpenseDto.category || ExpenseCategory.FOOD,
      splitType,
      expenseDate: createExpenseDto.expenseDate ? new Date(createExpenseDto.expenseDate) : new Date(),
    });

    const savedExpense = await this.expenseRepository.save(expense);

    for (const splitData of splitsToCreate) {
      const split = this.splitRepository.create({
        expense: savedExpense,
        user: splitData.user,
        amount: splitData.amount,
        percentage: splitData.percentage,
        isSettled: false,
      });
      await this.splitRepository.save(split);
    }

    return await this.expenseRepository.findOne({
      where: { id: savedExpense.id },
      relations: ['group', 'paidBy', 'splits', 'splits.user'],
    });
  }

  async findByGroup(groupId: string): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['paidBy', 'splits', 'splits.user'],
      order: { expenseDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async remove(groupId: string, expenseId: string): Promise<void> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, group: { id: groupId } },
    });

    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${expenseId} no encontrado en el grupo`);
    }

    await this.expenseRepository.remove(expense);
  }
}
