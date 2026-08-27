import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class UserBalanceDto {
  @ApiProperty({ description: 'Datos del usuario' })
  user: User;

  @ApiProperty({ example: 150.0, description: 'Total pagado en gastos por el usuario' })
  totalPaid: number;

  @ApiProperty({ example: 80.0, description: 'Total consumido / asignado en splits' })
  totalOwed: number;

  @ApiProperty({ example: 0.0, description: 'Total pagado en liquidaciones directas' })
  settlementsPaid: number;

  @ApiProperty({ example: 0.0, description: 'Total cobrado en liquidaciones directas' })
  settlementsReceived: number;

  @ApiProperty({ example: 70.0, description: 'Balance neto final (+ a favor, - en deuda)' })
  netBalance: number;
}

export class DebtSettlementSuggestionDto {
  @ApiProperty({ description: 'Usuario que debe transferir dinero (deudor)' })
  fromUser: User;

  @ApiProperty({ description: 'Usuario que debe recibir dinero (acreedor)' })
  toUser: User;

  @ApiProperty({ example: 45.0, description: 'Monto a transferir para saldar la deuda' })
  amount: number;
}

export class GroupBalanceSummaryDto {
  @ApiProperty({ example: 'uuid-group', description: 'ID del grupo' })
  groupId: string;

  @ApiProperty({ example: 450.0, description: 'Gasto total acumulado del grupo' })
  totalGroupSpending: number;

  @ApiProperty({ type: [UserBalanceDto], description: 'Detalle de balances netos por miembro' })
  memberBalances: UserBalanceDto[];

  @ApiProperty({
    type: [DebtSettlementSuggestionDto],
    description: 'Sugerencias optimizadas de transferencias calculadas con el algoritmo Min Cash Flow',
  })
  suggestedSettlements: DebtSettlementSuggestionDto[];
}
