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
import { CategoryService } from "./category.service";
import { CreateCategoryInput } from "./dto/createCategory.input";
import { ErrorResponseDto } from "src/utils/types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CategoryResponse } from "./dto/category-response";
import { Category } from "src/entities/category.entity";

@ApiTags("Category")
@Controller("category")
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new category",
    description: "Creates a new category under an activity",
  })
  @ApiBody({
    type: CreateCategoryInput,
    description: "Category creation data",
  })
  @ApiCreatedResponse({
    description: "Category successfully created",
    type: CategoryResponse
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
    @Body() createCategoryInput: CreateCategoryInput,
    @CurrentUser("id") userId: number,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryInput, userId);
  }

  @Get()
  @ApiOperation({
    summary: "Get all categories",
    description: "Retrieves a list of all categories in the system",
  })
  @ApiOkResponse({
    description: "List of categories retrieved successfully",
    type: [CategoryResponse],
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch categories",
    type: ErrorResponseDto,
  })
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get category by ID",
    description: "Retrieves a specific category by its unique identifier",
  })
  @ApiParam({
    name: "id",
    description: "Category ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "Category retrieved successfully",
    type: CategoryResponse
  })
  @ApiNotFoundResponse({
    description: "Category not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid Category ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch category",
    type: ErrorResponseDto,
  })
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Category> {
    return await this.categoryService.findOne(id);
  }

  @Get("activity/:activityId")
  @ApiOperation({
    summary: "Get categories by activity",
    description: "Retrieves all categories belonging to a specific activity",
  })
  @ApiParam({
    name: "activityId",
    description: "Activity ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "categories retrieved successfully",
    type: [CategoryResponse],
  })
  @ApiBadRequestResponse({
    description: "Invalid activity ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to fetch categories",
    type: ErrorResponseDto,
  })
  async findByActivity(
    @Param("activityId", ParseIntPipe) activityId: number,
  ): Promise<Category[]> {
    return await this.categoryService.findByActivity(activityId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete category",
    description: "Permanently deletes an category from the system",
  })
  @ApiParam({
    name: "id",
    description: "Category ID",
    type: "integer",
    example: 1,
  })
  @ApiOkResponse({
    description: "Category deleted successfully",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Category deleted successfully",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Category not found",
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid category ID format",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to delete category",
    type: ErrorResponseDto,
  })
  async remove(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.categoryService.remove(id);
    return { message: "Category deleted successfully" };
  }
}
