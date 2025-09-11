import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, HttpCode } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { ActivityService } from "./activity.service";
import { Activity } from "src/entities/activity.entity";
import { CreateActivityInput } from "./dto/createActivity.input";
import { UpdateActivityInput } from "./dto/updateActivity.input";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ActivityResponse } from "./dto/activity-response";

@ApiTags('Activity')
@Controller('activity')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new activity',
    description: 'Creates a new activity in a tournament'
  })
  @ApiBody({
    type: CreateActivityInput,
    description: 'Activity creation data'
  })
  @ApiCreatedResponse({
    description: 'Activity successfully created',
    type: ActivityResponse
  })
  @ApiNotFoundResponse({
    description: 'Tournament not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create activity',
    type: ErrorResponseDto,
  })
  async create(
    @Body() createActivityInput: CreateActivityInput,
    @CurrentUser('id') userId: number,
  ): Promise<Activity> {
    return await this.activityService.create(createActivityInput, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all activities',
    description: 'Retrieves a list of all activities in the system'
  })
  @ApiOkResponse({
    description: 'List of activities retrieved successfully',
    type: [ActivityResponse],
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch activities',
    type: ErrorResponseDto,
  })
  async findAll(): Promise<Activity[]> {
    return await this.activityService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get activity by ID',
    description: 'Retrieves a specific activity by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    description: 'Activity ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Activity retrieved successfully',
    type: ActivityResponse
  })
  @ApiNotFoundResponse({
    description: 'Activity not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid activity ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch activity',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Activity> {
    return await this.activityService.findOne(id);
  }

  @Get('tournament/:tournamentId')
  @ApiOperation({
    summary: 'Get activities by tournament',
    description: 'Retrieves all activities belonging to a specific tournament'
  })
  @ApiParam({
    name: 'tournamentId',
    description: 'Tournament ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Activities retrieved successfully',
    type: [ActivityResponse],
  })
  @ApiBadRequestResponse({
    description: 'Invalid tournament ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch activities',
    type: ErrorResponseDto,
  })
  async findByTournament(
    @Param('tournamentId', ParseIntPipe) tournamentId: number,
  ): Promise<Activity[]> {
    return await this.activityService.findByTournament(tournamentId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update activity',
    description: 'Updates activity information. Only provided fields will be updated.'
  })
  @ApiParam({
    name: 'id',
    description: 'Activity ID',
    type: 'integer',
    example: 1,
  })
  @ApiBody({
    type: UpdateActivityInput,
    description: 'Activity update data'
  })
  @ApiOkResponse({
    description: 'Activity updated successfully',
    type: ActivityResponse
  })
  @ApiNotFoundResponse({
    description: 'Activity not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or activity ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to update activity',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityInput: UpdateActivityInput,
  ): Promise<Activity> {
    return await this.activityService.update(id, updateActivityInput);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete activity',
    description: 'Permanently deletes an activity from the system'
  })
  @ApiParam({
    name: 'id',
    description: 'Activity ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Activity deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Activity deleted successfully'
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Activity not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid activity ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to delete activity',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.activityService.remove(id);
    return { message: 'Activity deleted successfully' };
  }
}