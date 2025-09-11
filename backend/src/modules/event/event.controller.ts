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
import { EventService } from "./event.service";
import { Event } from "src/entities/event.entity";
import { CreateEventInput } from "./dto/createEvent.input";
import { UpdateEventInput } from "./dto/updateEvent.input";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { EventResponse } from "./dto/event-response";

@ApiTags("Event")
@Controller("event")
@ApiBearerAuth()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new event",
    description: "Creates a new event under an activity",
  })
  @ApiBody({
    type: CreateEventInput,
    description: "Event creation data",
  })
  @ApiCreatedResponse({
    description: "Event successfully created",
    type: EventResponse
  })
  @ApiNotFoundResponse({
    description: "Activity not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to create event",
    type: ErrorResponseDto,
  })
  async create(
    @Body() createEventInput: CreateEventInput,
    @CurrentUser("id") userId: number,
  ): Promise<Event> {
    return await this.eventService.create(createEventInput, userId);
  }

  @Get()
  @ApiOperation({
    summary: "Get all events",
    description: "Retrieves a list of all events in the system",
  })
  @ApiOkResponse({
    description: "List of events retrieved successfully",
    type: [EventResponse],
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch events",
    type: ErrorResponseDto,
  })
  async findAll(): Promise<Event[]> {
    return await this.eventService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get event by ID",
    description: "Retrieves a specific event by its unique identifier",
  })
  @ApiParam({
    name: "id",
    description: "Event ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "Event retrieved successfully",
    type: EventResponse
  })
  @ApiNotFoundResponse({
    description: "Event not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid event ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch event",
    type: ErrorResponseDto,
  })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Event> {
    return await this.eventService.findOne(id);
  }

  @Get("activity/:activityId")
  @ApiOperation({
    summary: "Get events by activity",
    description: "Retrieves all events belonging to a specific activity",
  })
  @ApiParam({
    name: "activityId",
    description: "Activity ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "Events retrieved successfully",
    type: [EventResponse],
  })
  @ApiBadRequestResponse({
    description: "Invalid activity ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch events",
    type: ErrorResponseDto,
  })
  async findByActivity(
    @Param("activityId", ParseIntPipe) activityId: number,
  ): Promise<Event[]> {
    return await this.eventService.findByActivity(activityId);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update event",
    description:
      "Updates event information. Only provided fields will be updated.",
  })
  @ApiParam({
    name: "id",
    description: "Event ID",
    type: "integer",
    example: 1,
  })
  @ApiBody({
    type: UpdateEventInput,
    description: "Event update data",
  })
  @ApiOkResponse({
    description: "Event updated successfully",
    type: EventResponse
  })
  @ApiNotFoundResponse({
    description: "Event not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or event ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to update event",
    type: ErrorResponseDto,
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEventInput: UpdateEventInput,
  ): Promise<Event> {
    return await this.eventService.update(id, updateEventInput);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete event",
    description: "Permanently deletes an event from the system",
  })
  @ApiParam({
    name: "id",
    description: "Event ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "Event deleted successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Event deleted successfully",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Event not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid event ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to delete event",
    type: ErrorResponseDto,
  })
  async remove(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.eventService.remove(id);
    return { message: "Event deleted successfully" };
  }
}
