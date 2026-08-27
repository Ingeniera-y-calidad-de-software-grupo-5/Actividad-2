import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { User } from '../../users/entities/user.entity';

export enum SettlementStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
}

@Entity('settlements')
export class Settlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (group) => group.settlements, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  payer: User;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  receiver: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: SettlementStatus,
    default: SettlementStatus.COMPLETED,
  })
  status: SettlementStatus;

  @CreateDateColumn()
  createdAt: Date;
}
