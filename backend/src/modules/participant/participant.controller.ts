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
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ParticipantResponse } from "./dto/participant-response";
import { CreateTeamInput } from "./dto/createTeam.input";
import { Team } from "src/entities/team.entity";
import { CreateIndividualInput } from "./dto/createIndividual.input";
import { Individual } from "src/entities/Individual.entity";

@ApiTags("Participant")
@Controller("participant")
@ApiBearerAuth()
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  @Get("teams/:organizationId/:tournamentId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get teams by organization and tournament",
    description:
      "Retrieves all teams associated with a specific organization and tournament.",
  })
  @ApiParam({
    name: "organizationId",
    description: "ID of the organization",
    type: Number,
  })
  @ApiParam({
    name: "tournamentId",
    description: "ID of the tournament",
    type: Number,
  })
  @ApiOkResponse({
    description: "Teams retrieved successfully",
    type: [Team],
  })
  async getTeamsByOrganizationAndTournament(
    @Param("organizationId", ParseIntPipe) organizationId: number,
    @Param("tournamentId", ParseIntPipe) tournamentId: number
  ): Promise<Team[]> {
    return await this.participantService.getTeamsByOrganizationAndTournament(
      organizationId,
      tournamentId
    );
  }

  // @Post("individual")
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({
  //   summary: "Create a new individual participant",
  //   description:
  //     "Creates a new individual participant with the provided information.",
  // })
  // @ApiBody({
  //   type: CreateIndividualInput,
  //   description: "Participant creation data",
  // })
  // @ApiCreatedResponse({
  //   description: "Participant successfully created",
  //   type: ParticipantResponse,
  // })
  // @ApiConflictResponse({
  //   description: "Participant slug already exists",
  //   type: ErrorResponseDto,
  // })
  // @ApiNotFoundResponse({
  //   description: "Organization not found",
  //   type: ErrorResponseDto,
  // })
  // @ApiInternalServerErrorResponse({
  //   description: "Failed to create participant",
  //   type: ErrorResponseDto,
  // })
  // async createIndividual(
  //   @Body() createIndividualInput: CreateIndividualInput,
  //   @CurrentUser("id") userId: number,
  // ): Promise<Individual> {
  //   return await this.participantService.createIndividual(
  //     createIndividualInput,
  //     userId,
  //   );
  // }

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
  ): Promise<Team> {
    return await this.participantService.createTeam(createTeamInput, userId);
  }

}
