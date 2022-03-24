import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { MongoModule } from './database/mongodb/mongodb.module';
import { MODULES } from './modules';
import { InterceptorModule } from './share/interceptor/interceptor.module';
import { HttpLoggerMiddleware } from './share/middleware/http-logger.middleware';
import { PipeModule } from './share/pipe/pipe.module';

@Module({
  imports: [ConfigurationModule, MongoModule, PipeModule, InterceptorModule, ...MODULES],
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
