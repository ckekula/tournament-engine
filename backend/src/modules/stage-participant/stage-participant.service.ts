import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupStage } from 'src/entities/groupStage.entity';
import { Group } from 'src/entities/group.entity';
import { Participant } from 'src/entities/participant.entity';
import { GroupStageParticipant } from 'src/entities/groupStageParticipant.entity';
import { CreateGroupStageParticipantInput } from './dto/createGroupStageParticipant.input';
import { StageParticipant } from 'src/entities/stageParticipant.entity';

@Injectable()
export class StageParticipantService {
  constructor(
    @InjectRepository(StageParticipant)
    private readonly stageParticipantRepository: Repository<StageParticipant>,
    @InjectRepository(GroupStage)
    private readonly groupStageParticipantRepository: Repository<GroupStageParticipant>,
    @InjectRepository(GroupStage)
    private readonly groupStageRepository: Repository<GroupStage>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<GroupStage>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async createGroupStageParticipants(createGroupStageParticipantInput: CreateGroupStageParticipantInput): Promise<GroupStageParticipant[]> {
    const { stageId, groupId, participantIds } = createGroupStageParticipantInput

    const stage = await this.groupStageRepository.findOne({
        where: { id: stageId },
    });

    if (!stage) {
    throw new NotFoundException(`Stage with ID ${stageId} not found`);
    }

    const group = await this.groupRepository.findOne({
        where: { id: groupId },
    });

    if (!group) {
    throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    try {
      const groupStageParticipants = participantIds.map(participantId => 
        this.groupStageParticipantRepository.create({ 
          stage, 
          group, 
          participant: { id: participantId } 
        })
      );
      
      return await this.groupStageParticipantRepository.save(groupStageParticipants);
    } catch(error) {
        throw new InternalServerErrorException('Failed to crate group stage participants',
    );
    }
  }
}
