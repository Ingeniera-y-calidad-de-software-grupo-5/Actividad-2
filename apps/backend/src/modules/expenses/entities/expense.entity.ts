import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { User } from '../../users/entities/user.entity';
import { ExpenseSplit } from './expense-split.entity';

export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ACCOMMODATION = 'ACCOMMODATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SERVICES = 'SERVICES',
  OTHER = 'OTHER',
}

export enum SplitType {
  EQUAL = 'EQUAL',
  EXACT = 'EXACT',
  PERCENTAGE = 'PERCENTAGE',
}

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.expenses, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(() => User, (user) => user.paidExpenses, { eager: true, onDelete: 'CASCADE' })
  paidBy: User;

  @Column({ length: 150 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ExpenseCategory,
    default: ExpenseCategory.FOOD,
  })
  category: ExpenseCategory;

  @Column({
    type: 'enum',
    enum: SplitType,
    default: SplitType.EQUAL,
  })
  splitType: SplitType;

  @Column({ type: 'date' })
  expenseDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ExpenseSplit, (split) => split.expense, { cascade: true, eager: true })
  splits: ExpenseSplit[];
}
