import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group, GroupCategory } from './entities/group.entity';
import { GroupMember, MemberRole } from './entities/group-member.entity';
import { User } from '../users/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly memberRepository: Repository<GroupMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create({
      name: createGroupDto.name,
      description: createGroupDto.description,
      category: createGroupDto.category || GroupCategory.TRIP,
      currency: createGroupDto.currency || 'USD',
    });

    const savedGroup = await this.groupRepository.save(group);

    if (createGroupDto.initialMemberIds && createGroupDto.initialMemberIds.length > 0) {
      for (let i = 0; i < createGroupDto.initialMemberIds.length; i++) {
        const userId = createGroupDto.initialMemberIds[i];
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
          const member = this.memberRepository.create({
            group: savedGroup,
            user,
            role: i === 0 ? MemberRole.ADMIN : MemberRole.MEMBER,
          });
          await this.memberRepository.save(member);
        }
      }
    }

    return this.findOne(savedGroup.id);
  }

  async findAll(): Promise<Group[]> {
    return await this.groupRepository.find({
      relations: ['members', 'members.user', 'expenses', 'expenses.paidBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: [
        'members',
        'members.user',
        'expenses',
        'expenses.paidBy',
        'expenses.splits',
        'expenses.splits.user',
        'settlements',
        'settlements.payer',
        'settlements.receiver',
      ],
      order: {
        expenses: { createdAt: 'DESC' },
      },
    });

    if (!group) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    return group;
  }

  async addMember(groupId: string, addMemberDto: AddMemberDto): Promise<GroupMember> {
    const group = await this.groupRepository.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    const user = await this.userRepository.findOne({ where: { id: addMemberDto.userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${addMemberDto.userId} no encontrado`);
    }

    const existing = await this.memberRepository.findOne({
      where: { group: { id: groupId }, user: { id: addMemberDto.userId } },
    });

    if (existing) {
      throw new ConflictException('El usuario ya es miembro de este grupo');
    }

    const member = this.memberRepository.create({
      group,
      user,
      role: addMemberDto.role || MemberRole.MEMBER,
    });

    return await this.memberRepository.save(member);
  }

  async getMembers(groupId: string): Promise<GroupMember[]> {
    await this.findOne(groupId);
    return await this.memberRepository.find({
      where: { group: { id: groupId } },
      relations: ['user'],
    });
  }
}
