import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateSettlementDto {
  @ApiProperty({ example: 'uuid-payer', description: 'ID del usuario que realiza el pago (deudor)' })
  @IsUUID()
  @IsNotEmpty()
  payerId: string;

  @ApiProperty({ example: 'uuid-receiver', description: 'ID del usuario que recibe el pago (acreedor)' })
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ example: 45.5, description: 'Monto a liquidar' })
  @IsNumber()
  @IsPositive()
  amount: number;
}
