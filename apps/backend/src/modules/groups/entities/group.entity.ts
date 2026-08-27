import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { GroupMember } from './group-member.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { Settlement } from '../../balances/entities/settlement.entity';

export enum GroupCategory {
  TRIP = 'TRIP',
  HOUSE = 'HOUSE',
  EVENT = 'EVENT',
  OTHER = 'OTHER',
}

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: GroupCategory,
    default: GroupCategory.TRIP,
  })
  category: GroupCategory;

  @Column({ length: 10, default: 'USD' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => GroupMember, (member) => member.group, { cascade: true })
  members: GroupMember[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];

  @OneToMany(() => Settlement, (settlement) => settlement.group)
  settlements: Settlement[];
}
