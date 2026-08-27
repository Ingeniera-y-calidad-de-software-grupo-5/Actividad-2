import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseCategory, SplitType } from '../entities/expense.entity';

export class SplitItemDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID de usuario asignado al split' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ example: 25.5, description: 'Monto asignado si el split es EXACT o calculado' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ example: 33.33, description: 'Porcentaje asignado si el split es PERCENTAGE' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  percentage?: number;
}

export class CreateExpenseDto {
  @ApiProperty({ example: 'Cena de Bienvenida en Restaurante', description: 'Concepto o descripción del gasto' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 120.0, description: 'Monto total del gasto' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID del usuario pagador' })
  @IsUUID()
  @IsNotEmpty()
  paidById: string;

  @ApiPropertyOptional({ enum: ExpenseCategory, default: ExpenseCategory.FOOD, description: 'Categoría del gasto' })
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @ApiPropertyOptional({ enum: SplitType, default: SplitType.EQUAL, description: 'Tipo de división del gasto' })
  @IsEnum(SplitType)
  @IsOptional()
  splitType?: SplitType;

  @ApiPropertyOptional({ example: '2026-08-27', description: 'Fecha en que se efectuó el gasto' })
  @IsString()
  @IsOptional()
  expenseDate?: string;

  @ApiPropertyOptional({
    example: ['user-uuid-1', 'user-uuid-2', 'user-uuid-3'],
    description: 'IDs de participantes para división equitativa automática (Split EQUAL)',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  participantIds?: string[];

  @ApiPropertyOptional({
    description: 'Lista detallada de splits personalizados (requerido para EXACT o PERCENTAGE)',
    type: [SplitItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SplitItemDto)
  @IsOptional()
  customSplits?: SplitItemDto[];
}
