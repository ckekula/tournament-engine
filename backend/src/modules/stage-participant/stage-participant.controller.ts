import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { CreateGroupStageParticipantInput } from "./dto/createGroupStageParticipant.input";
import { GroupParticipant } from "src/entities/groupStageParticipant.entity";
import { ErrorResponseDto } from "src/utils/types";
import { StageParticipantService } from "./stage-participant.service";

@Controller('stage-participant')
export class StageParticipantController {
  constructor(
    private readonly stageParticipantService: StageParticipantService
    ,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new stage",
    description: "Creates a new stage under event",
  })
  @ApiBody({
    type: CreateGroupStageParticipantInput,
    description: "Stage creation data",
  })
  @ApiCreatedResponse({
    description: "Stage successfully created",
    type: GroupParticipant,
  })
  @ApiNotFoundResponse({
    description: "Event not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to create stage",
    type: ErrorResponseDto,
  })
  async createGroupStageParticipants(
    @Body() createGroupStageParticipantInput: CreateGroupStageParticipantInput,
  ): Promise<GroupParticipant[]> {
    return await this.stageParticipantService.createGroupStageParticipants(createGroupStageParticipantInput);
  }


}
