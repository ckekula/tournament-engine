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
import { StageService } from "./stage.service";
import { CreateStageInput } from "./dto/createStage.input";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { StageResponse } from "./dto/stage-response";
import { UpdateStageInput } from "./dto/updateStage.input";

@ApiTags("Stage")
@Controller("stage")
@ApiBearerAuth()
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new stage",
    description: "Creates a new stage under a category or event",
  })
  @ApiBody({
    type: CreateStageInput,
    description: "Stage creation data",
  })
  @ApiCreatedResponse({
    description: "Stage successfully created",
    type: StageResponse,
  })
  @ApiNotFoundResponse({
    description: "Category or event not found",
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
  async create(
    @Body() createStageInput: CreateStageInput,
    @CurrentUser("id") userId: number,
  ): Promise<StageResponse> {
    return await this.stageService.create(createStageInput, userId);
  }

  @Get()
  @ApiOperation({
    summary: "Get all stages",
    description: "Retrieves a list of all stages in the system",
  })
  @ApiOkResponse({
    description: "List of stages retrieved successfully",
    type: [StageResponse],
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch stages",
    type: ErrorResponseDto,
  })
  async findAll(): Promise<StageResponse[]> {
    return await this.stageService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get stage by ID",
    description: "Retrieves a specific stage by its unique identifier",
  })
  @ApiParam({
    name: "id",
    description: "Stage ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "Stage retrieved successfully",
    type: StageResponse,
  })
  @ApiNotFoundResponse({
    description: "Stage not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid stage ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch stage",
    type: ErrorResponseDto,
  })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<StageResponse> {
    return await this.stageService.findOne(id);
  }

  @Get("event/:eventId")
  @ApiOperation({
    summary: "Get stages by event",
    description: "Retrieves all stages belonging to a specific event",
  })
  @ApiParam({
    name: "eventId",
    description: "Event ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "Stages retrieved successfully",
    type: [StageResponse],
  })
  @ApiBadRequestResponse({
    description: "Invalid event ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch stages",
    type: ErrorResponseDto,
  })
  async findByEvent(
    @Param("eventId", ParseIntPipe) eventId: number,
  ): Promise<StageResponse[]> {
    return await this.stageService.findByEvent(eventId);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update stage",
    description: "Updates stage information. Only provided fields will be updated.",
  })
  @ApiParam({
    name: "id",
    description: "Stage ID",
    type: "integer",
    example: 1,
  })
  @ApiBody({
    type: CreateStageInput, // ⬅️ If you have an UpdateStageInput, replace this
    description: "Stage update data",
  })
  @ApiOkResponse({
    description: "Stage updated successfully",
    type: StageResponse,
  })
  @ApiNotFoundResponse({
    description: "Stage not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or stage ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to update stage",
    type: ErrorResponseDto,
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStageInput: UpdateStageInput,
  ): Promise<StageResponse> {
    return await this.stageService.update(id, updateStageInput);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete stage",
    description: "Permanently deletes a stage from the system",
  })
  @ApiParam({
    name: "id",
    description: "Stage ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "Stage deleted successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Stage deleted successfully",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Stage not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid stage ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to delete stage",
    type: ErrorResponseDto,
  })
  async remove(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.stageService.remove(id);
    return { message: "Stage deleted successfully" };
  }
}
