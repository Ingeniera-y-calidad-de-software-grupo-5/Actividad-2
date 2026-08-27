import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { GroupMember } from '../../groups/entities/group-member.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { ExpenseSplit } from '../../expenses/entities/expense-split.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ nullable: true, length: 255 })
  avatarUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => GroupMember, (member) => member.user)
  memberships: GroupMember[];

  @OneToMany(() => Expense, (expense) => expense.paidBy)
  paidExpenses: Expense[];

  @OneToMany(() => ExpenseSplit, (split) => split.user)
  expenseSplits: ExpenseSplit[];
}
