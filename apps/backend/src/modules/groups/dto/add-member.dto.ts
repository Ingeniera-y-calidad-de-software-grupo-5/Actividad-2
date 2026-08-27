import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { MemberRole } from '../entities/group-member.entity';

export class AddMemberDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID de usuario a agregar' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ enum: MemberRole, default: MemberRole.MEMBER, description: 'Rol dentro del grupo' })
  @IsEnum(MemberRole)
  @IsOptional()
  role?: MemberRole;
}
