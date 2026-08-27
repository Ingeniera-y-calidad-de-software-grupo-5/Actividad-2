import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GroupCategory } from '../entities/group.entity';

export class CreateGroupDto {
  @ApiProperty({ example: 'Viaje a Bariloche 2026', description: 'Nombre descriptivo del grupo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Gastos de cabaña, comidas, traslados y pases de esquí', description: 'Descripción opcional' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: GroupCategory, default: GroupCategory.TRIP, description: 'Categoría del grupo' })
  @IsEnum(GroupCategory)
  @IsOptional()
  category?: GroupCategory;

  @ApiPropertyOptional({ example: 'USD', default: 'USD', description: 'Moneda principal del grupo' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    example: ['uuid-user-1', 'uuid-user-2'],
    description: 'Lista de IDs de usuarios miembros iniciales',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  initialMemberIds?: string[];
}
