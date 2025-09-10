import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, HttpCode, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiQuery } from "@nestjs/swagger";
import { TournamentService } from "./tournament.service";
import { Tournament } from "src/entities/tournament.entity";
import { CreateTournamentInput } from "./dto/createTournament.input";
import { UpdateTournamentInput } from "./dto/updateTournament.input";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags('Tournament')
@Controller('tournament')
@ApiBearerAuth()
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new tournament',
    description: 'Creates a new tournament with the provided information. Slug must be unique.'
  })
  @ApiBody({
    type: CreateTournamentInput,
    description: 'Tournament creation data'
  })
  @ApiCreatedResponse({
    description: 'Tournament successfully created',
    type: Tournament,
  })
  @ApiConflictResponse({
    description: 'Tournament slug already exists',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create tournament',
    type: ErrorResponseDto,
  })
  async create(
    @Body() createTournamentInput: CreateTournamentInput,
    @CurrentUser('id') userId: number,
  ): Promise<Tournament> {
    return await this.tournamentService.create(createTournamentInput, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tournaments',
    description: 'Retrieves a list of all tournaments in the system'
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    type: 'integer',
    description: 'Filter tournaments by organization ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'List of tournaments retrieved successfully',
    type: [Tournament],
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch tournaments',
    type: ErrorResponseDto,
  })
  async findAll(
    @Query('organizationId', new ParseIntPipe({ optional: true })) organizationId?: number,
  ): Promise<Tournament[]> {
    if (organizationId) {
      return await this.tournamentService.findByOrganization(organizationId);
    }
    return await this.tournamentService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get tournament by ID',
    description: 'Retrieves a specific tournament by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    description: 'Tournament ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tournament retrieved successfully',
    type: Tournament,
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid tournament ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch tournament',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Tournament> {
    return await this.tournamentService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get tournament by slug',
    description: 'Retrieves a specific tournament by its unique slug'
  })
  @ApiParam({
    name: 'slug',
    description: 'Tournament slug',
    type: 'string',
    example: 'my-tournament',
  })
  @ApiOkResponse({
    description: 'Tournament retrieved successfully',
    type: Tournament,
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch tournament',
    type: ErrorResponseDto,
  })
  async findBySlug(@Param('slug') slug: string): Promise<Tournament> {
    return await this.tournamentService.findBySlug(slug);
  }

  @Get('organization/:organizationId')
  @ApiOperation({
    summary: 'Get tournaments by organization',
    description: 'Retrieves all tournaments belonging to a specific organization'
  })
  @ApiParam({
    name: 'organizationId',
    description: 'Organization ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tournaments retrieved successfully',
    type: [Tournament],
  })
  @ApiBadRequestResponse({
    description: 'Invalid organization ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch tournaments',
    type: ErrorResponseDto,
  })
  async findByOrganization(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<Tournament[]> {
    return await this.tournamentService.findByOrganization(organizationId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update tournament',
    description: 'Updates tournament information. Only provided fields will be updated.'
  })
  @ApiParam({
    name: 'id',
    description: 'Tournament ID',
    type: 'integer',
    example: 1,
  })
  @ApiBody({
    type: UpdateTournamentInput,
    description: 'Tournament update data'
  })
  @ApiOkResponse({
    description: 'Tournament updated successfully',
    type: Tournament,
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Tournament slug already exists',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or tournament ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to update tournament',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTournamentInput: UpdateTournamentInput,
  ): Promise<Tournament> {
    return await this.tournamentService.update(id, updateTournamentInput);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete tournament',
    description: 'Permanently deletes a tournament from the system'
  })
  @ApiParam({
    name: 'id',
    description: 'Tournament ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Tournament deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Tournament deleted successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid tournament ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to delete tournament',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.tournamentService.remove(id);
    return { message: 'Tournament deleted successfully' };
  }
}