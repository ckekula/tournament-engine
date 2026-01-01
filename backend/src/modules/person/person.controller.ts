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
import { PersonService } from "./person.service";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreatePersonInput } from "./dto/createPerson.input";
import { PersonResponse } from "./dto/person-response";

@ApiTags("Participant")
@Controller("participant")
@ApiBearerAuth()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new person",
    description: "Creates a new person under an organization",
  })
  @ApiBody({
    type: CreatePersonInput,
    description: "Person creation data",
  })
  @ApiCreatedResponse({
    description: "Person successfully created",
    type: PersonResponse
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
    description: "Failed to create category",
    type: ErrorResponseDto,
  })
  async create(
    @Body() createPersonInput: CreatePersonInput,
    @CurrentUser("id") userId: number,
  ): Promise<PersonResponse> {
    return await this.personService.create(userId, createPersonInput);
  }

  @Get("organization/:organizationId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Find persons by organization",
    description: "Retrieves all persons associated with a specific organization",
  })
  @ApiParam({
    name: "organizationId",
    type: Number,
    description: "ID of the organization",
  })
  @ApiOkResponse({
    description: "Persons successfully retrieved",
    type: PersonResponse,
  })
  @ApiNotFoundResponse({
    description: "Organization not found",
    type: ErrorResponseDto,
  })
  async findByOrganization(
    @Param("organizationId", ParseIntPipe) organizationId: number,
  ): Promise<PersonResponse[]> {
    return await this.personService.findByOrganization(organizationId);
  }
}