import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BaseIdRequestDto, BasePaginationRequestDto } from 'src/share/dto/base.dto';
import { IJwtPayload } from 'src/share/interface/auth.interface';
import { ValidationQueryPipe } from 'src/share/pipe/validation.pipe';
import { CreatePostRequestDto, ListPostDataResponseDto } from './dtos/posts.dto';
import { PostsService } from './posts.service';

@ApiTags('Post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiBearerAuth()
  createPost(@Request() request, @Body() body: CreatePostRequestDto) {
    const userId = (request.user as IJwtPayload)?.userId;
    return this.postsService.createPost(userId, body);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ListPostDataResponseDto] })
  @UsePipes(ValidationQueryPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getListPost(@Query() query: BasePaginationRequestDto) {
    return this.postsService.getListPosts(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ListPostDataResponseDto })
  @UsePipes(ValidationQueryPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  getPost(@Param() param: BaseIdRequestDto) {
    return this.postsService.getPostById(param.id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UsePipes(ValidationQueryPipe)
  updatePost(@Request() request, @Param() param: BaseIdRequestDto, @Body() body: CreatePostRequestDto) {
    const userId = (request.user as IJwtPayload)?.userId;
    return this.postsService.updatePost(userId, param.id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UsePipes(ValidationQueryPipe)
  deletePost(@Request() request, @Param() param: BaseIdRequestDto) {
    const userId = (request.user as IJwtPayload)?.userId;
    return this.postsService.deletePost(userId, param.id);
  }
}
