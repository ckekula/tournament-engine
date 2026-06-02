import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupStage } from 'src/entities/groupStage.entity';
import { Group } from 'src/entities/group.entity';
import { Participant } from 'src/entities/participant.entity';
import { GroupParticipant } from 'src/entities/groupParticipant.entity';
import { CreateGroupStageParticipantInput } from './dto/createGroupStageParticipant.input';
import { StageParticipant } from 'src/entities/stageParticipant.entity';

@Injectable()
export class StageParticipantService {
  constructor(
    @InjectRepository(GroupParticipant)
    private readonly groupParticipantRepository: Repository<GroupParticipant>,
    @InjectRepository(GroupStage)
    private readonly groupStageRepository: Repository<GroupStage>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async createGroupStageParticipants(createGroupStageParticipantInput: CreateGroupStageParticipantInput): Promise<GroupParticipant[]> {
    const { groupId, participantIds } = createGroupStageParticipantInput

    const group = await this.groupRepository.findOne({
        where: { id: groupId },
    });

    if (!group) {
    throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    try {
      const groupStageParticipants = participantIds.map(participantId => 
        this.groupParticipantRepository.create({ 
          group, 
          participant: { id: participantId } 
        })
      );
      
      return await this.groupParticipantRepository.save(groupStageParticipants);
    } catch(error) {
        throw new InternalServerErrorException('Failed to create group stage participants',
    );
    }
  }
}
