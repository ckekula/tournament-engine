import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { CreateGroupStageParticipantInput } from "./dto/createGroupStageParticipant.input";
import { GroupStageParticipant } from "src/entities/groupStageParticipant.entity";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
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
    type: GroupStageParticipant,
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
  ): Promise<GroupStageParticipant[]> {
    return await this.stageParticipantService.createGroupStageParticipants(createGroupStageParticipantInput);
  }
}
