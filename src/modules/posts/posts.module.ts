import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { UsersModule } from '../users/users.module';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), forwardRef(() => UsersModule)],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
