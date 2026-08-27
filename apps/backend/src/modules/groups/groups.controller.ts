import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { Group } from './entities/group.entity';
import { GroupMember } from './entities/group-member.entity';

@ApiTags('Grupos')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo grupo (Viajes, Casas, Eventos)' })
  @ApiResponse({ status: 201, description: 'Grupo creado exitosamente', type: Group })
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los grupos' })
  @ApiResponse({ status: 200, description: 'Listado de grupos', type: [Group] })
  findAll(): Promise<Group[]> {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle completo de un grupo' })
  @ApiResponse({ status: 200, description: 'Detalle de grupo', type: Group })
  findOne(@Param('id') id: string): Promise<Group> {
    return this.groupsService.findOne(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Añadir un participante al grupo' })
  @ApiResponse({ status: 201, description: 'Miembro añadido', type: GroupMember })
  addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
  ): Promise<GroupMember> {
    return this.groupsService.addMember(id, addMemberDto);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Listar participantes de un grupo' })
  @ApiResponse({ status: 200, description: 'Listado de miembros', type: [GroupMember] })
  getMembers(@Param('id') id: string): Promise<GroupMember[]> {
    return this.groupsService.getMembers(id);
  }
}
