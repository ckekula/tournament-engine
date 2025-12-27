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
  Query,
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
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { ParticipantService } from "./participant.service";
import { Participant } from "src/entities/participant.entity";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateParticipantInput } from "./dto/createParticipant.input";
import { ParticipantResponse } from "./dto/participant-response";
import { UpdateParticipantInput } from "./dto/updateParticipant.input";
import { CreateTeamInput } from "./dto/createTeam.input";

@ApiTags("Participant")
@Controller("participant")
@ApiBearerAuth()
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Post("individual")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new individual participant",
    description:
      "Creates a new individual participant with the provided information.",
  })
  @ApiBody({
    type: CreateParticipantInput,
    description: "Participant creation data",
  })
  @ApiCreatedResponse({
    description: "Participant successfully created",
    type: ParticipantResponse,
  })
  @ApiConflictResponse({
    description: "Participant slug already exists",
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Organization not found",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to create participant",
    type: ErrorResponseDto,
  })
  async create(
    @Body() createParticipantInput: CreateParticipantInput,
    @CurrentUser("id") userId: number,
  ): Promise<Participant> {
    return await this.participantService.create(
      createParticipantInput,
      userId,
    );
  }

  @Post("team")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new team",
    description:
      "Creates a new team with the provided information.",
  })
  @ApiBody({
    type: CreateTeamInput,
    description: "Participant creation data",
  })
  @ApiCreatedResponse({
    description: "Participant successfully created",
    type: ParticipantResponse,
  })
  @ApiConflictResponse({
    description: "Participant slug already exists",
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Organization not found",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to create participant",
    type: ErrorResponseDto,
  })
  async createTeam(
    @Body() createTeamInput: CreateTeamInput,
    @CurrentUser("id") userId: number,
  ): Promise<Participant> {
    return await this.participantService.createTeam(createTeamInput, userId);
  }

}
