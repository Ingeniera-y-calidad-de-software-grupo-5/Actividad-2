import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Group, GroupCategory } from '../groups/entities/group.entity';
import { GroupMember, MemberRole } from '../groups/entities/group-member.entity';
import { Expense, ExpenseCategory, SplitType } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';
import { Settlement, SettlementStatus } from '../balances/entities/settlement.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly memberRepository: Repository<GroupMember>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private readonly splitRepository: Repository<ExpenseSplit>,
    @InjectRepository(Settlement)
    private readonly settlementRepository: Repository<Settlement>,
  ) {}

  async runSeed(): Promise<{ message: string; usersCount: number; groupsCount: number }> {
    this.logger.log('Iniciando carga de datos semilla (Seed)...');

    // 1. Crear Usuarios Demo
    const usersData = [
      {
        name: 'Santiago López',
        email: 'santiago@amigogasto.app',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      },
      {
        name: 'Martina Rossi',
        email: 'martina@amigogasto.app',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
      {
        name: 'Lucas Benítez',
        email: 'lucas@amigogasto.app',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      },
      {
        name: 'Valentina Gómez',
        email: 'valentina@amigogasto.app',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      },
    ];

    const users: User[] = [];
    for (const uData of usersData) {
      let user = await this.userRepository.findOne({ where: { email: uData.email } });
      if (!user) {
        user = this.userRepository.create(uData);
        user = await this.userRepository.save(user);
      }
      users.push(user);
    }

    // 2. Crear Grupo 1: Viaje a Bariloche 2026 (Category: TRIP)
    let tripGroup = await this.groupRepository.findOne({
      where: { name: 'Viaje a Bariloche 2026' },
      relations: ['members'],
    });

    if (!tripGroup) {
      tripGroup = this.groupRepository.create({
        name: 'Viaje a Bariloche 2026',
        description: 'Gastos de cabaña, comidas, pases de esquí y combustible',
        category: GroupCategory.TRIP,
        currency: 'USD',
      });
      tripGroup = await this.groupRepository.save(tripGroup);

      // Agregar a los 4 usuarios
      for (let i = 0; i < users.length; i++) {
        const member = this.memberRepository.create({
          group: tripGroup,
          user: users[i],
          role: i === 0 ? MemberRole.ADMIN : MemberRole.MEMBER,
        });
        await this.memberRepository.save(member);
      }

      // Gastos del Viaje
      // Gasto 1: Santiago pagó Cabaña $240 (dividido entre los 4 = $60 c/u)
      const exp1 = await this.expenseRepository.save(
        this.expenseRepository.create({
          group: tripGroup,
          paidBy: users[0],
          description: 'Alquiler Cabaña Cerro Catedral (3 noches)',
          amount: 240.0,
          category: ExpenseCategory.ACCOMMODATION,
          splitType: SplitType.EQUAL,
          expenseDate: new Date('2026-08-20'),
        }),
      );
      for (const u of users) {
        await this.splitRepository.save(
          this.splitRepository.create({
            expense: exp1,
            user: u,
            amount: 60.0,
            percentage: 25.0,
          }),
        );
      }

      // Gasto 2: Martina pagó Cena Asado $100 (dividido entre los 4 = $25 c/u)
      const exp2 = await this.expenseRepository.save(
        this.expenseRepository.create({
          group: tripGroup,
          paidBy: users[1],
          description: 'Cena de Bienvenida Asado & Vinos',
          amount: 100.0,
          category: ExpenseCategory.FOOD,
          splitType: SplitType.EQUAL,
          expenseDate: new Date('2026-08-21'),
        }),
      );
      for (const u of users) {
        await this.splitRepository.save(
          this.splitRepository.create({
            expense: exp2,
            user: u,
            amount: 25.0,
            percentage: 25.0,
          }),
        );
      }

      // Gasto 3: Lucas pagó Combustible $60 (dividido entre Santiago, Martina y Lucas = $20 c/u)
      const exp3 = await this.expenseRepository.save(
        this.expenseRepository.create({
          group: tripGroup,
          paidBy: users[2],
          description: 'Carga de Combustible Ruta 40',
          amount: 60.0,
          category: ExpenseCategory.TRANSPORT,
          splitType: SplitType.EQUAL,
          expenseDate: new Date('2026-08-22'),
        }),
      );
      for (const u of [users[0], users[1], users[2]]) {
        await this.splitRepository.save(
          this.splitRepository.create({
            expense: exp3,
            user: u,
            amount: 20.0,
            percentage: 33.33,
          }),
        );
      }
    }

    // 3. Crear Grupo 2: Departamento Palermo (Category: HOUSE)
    let houseGroup = await this.groupRepository.findOne({
      where: { name: 'Departamento Palermo' },
    });

    if (!houseGroup) {
      houseGroup = this.groupRepository.create({
        name: 'Departamento Palermo',
        description: 'Gastos de convivencia, internet, limpieza y compras comunitarias',
        category: GroupCategory.HOUSE,
        currency: 'USD',
      });
      houseGroup = await this.groupRepository.save(houseGroup);

      // Agregar a Santiago, Martina y Valentina
      const houseUsers = [users[0], users[1], users[3]];
      for (let i = 0; i < houseUsers.length; i++) {
        const member = this.memberRepository.create({
          group: houseGroup,
          user: houseUsers[i],
          role: i === 0 ? MemberRole.ADMIN : MemberRole.MEMBER,
        });
        await this.memberRepository.save(member);
      }

      // Gasto Departamento: Valentina pagó Internet y Servicios $90 ($30 c/u)
      const expHouse = await this.expenseRepository.save(
        this.expenseRepository.create({
          group: houseGroup,
          paidBy: users[3],
          description: 'Fibra Óptica 1Gbps + Expensas',
          amount: 90.0,
          category: ExpenseCategory.SERVICES,
          splitType: SplitType.EQUAL,
          expenseDate: new Date('2026-08-15'),
        }),
      );
      for (const u of houseUsers) {
        await this.splitRepository.save(
          this.splitRepository.create({
            expense: expHouse,
            user: u,
            amount: 30.0,
            percentage: 33.33,
          }),
        );
      }
    }

    this.logger.log('Seed ejecutado satisfactoriamente.');
    const totalUsers = await this.userRepository.count();
    const totalGroups = await this.groupRepository.count();

    return {
      message: 'Base de datos inicializada con datos semilla con éxito',
      usersCount: totalUsers,
      groupsCount: totalGroups,
    };
  }
}
