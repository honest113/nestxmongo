import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

export const MODULES = [UsersModule, AuthModule, PostsModule];
