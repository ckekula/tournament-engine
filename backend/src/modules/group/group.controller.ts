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
import { GroupService } from "./group.service";
import { Group } from "src/entities/group.entity";
import { CreateGroupInput } from "./dto/createGroup.input";
import { UpdateGroupInput } from "./dto/updateGroup.input";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { GroupResponse } from "./dto/group-response";

@ApiTags('Group')
@Controller('group')
@ApiBearerAuth()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new group',
    description: 'Creates a new group inside a group stage',
  })
  @ApiBody({
    type: CreateGroupInput,
    description: 'Group creation data',
  })
  @ApiCreatedResponse({
    description: 'Group successfully created',
    type: GroupResponse,
  })
  @ApiNotFoundResponse({
    description: 'Group stage not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create group',
    type: ErrorResponseDto,
  })
  async create(
    @Body() createGroupInput: CreateGroupInput,
    // @CurrentUser('id') userId: number,
): Promise<Group> {
    return await this.groupService.create(createGroupInput);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get group by ID',
    description: 'Retrieves a specific group by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Group ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Group retrieved successfully',
    type: GroupResponse,
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid group ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch group',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Group> {
    return await this.groupService.findOne(id);
  }

  @Get('stage/:stageId')
  @ApiOperation({
    summary: 'Get groups by stage',
    description: 'Retrieves all groups belonging to a specific group stage',
  })
  @ApiParam({
    name: 'stageId',
    description: 'Group stage ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Groups retrieved successfully',
    type: [GroupResponse],
  })
  @ApiBadRequestResponse({
    description: 'Invalid stage ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to fetch groups',
    type: ErrorResponseDto,
  })
  async findByStage(@Param('stageId', ParseIntPipe) stageId: number): Promise<Group[]> {
    return await this.groupService.findByStage(stageId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update group',
    description: 'Updates group information. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Group ID',
    type: 'integer',
    example: 1,
  })
  @ApiBody({
    type: UpdateGroupInput,
    description: 'Group update data',
  })
  @ApiOkResponse({
    description: 'Group updated successfully',
    type: GroupResponse,
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or group ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to update group',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGroupInput: UpdateGroupInput,
  ): Promise<Group> {
    return await this.groupService.update(id, updateGroupInput);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete group',
    description: 'Permanently deletes a group from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'Group ID',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Group deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Group deleted successfully',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid group ID format',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to delete group',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.groupService.remove(id);
    return { message: 'Group deleted successfully' };
  }
}
