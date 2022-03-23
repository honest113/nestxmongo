import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { MongoModule } from './database/mongodb/mongodb.module';
import { HttpLoggerMiddleware } from './share/middleware/http-logger.middleware';

@Module({
  imports: [ConfigurationModule, MongoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV === 'development') {
      consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    }
  }
}
