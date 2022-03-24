import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

class ResponseSuccess {
  private readonly message: string = 'Success';
  private readonly success: boolean = true;
  private data: any;

  constructor(data: any) {
    if (!data) return;

    if (data && typeof data === 'object' && data.data) {
      this.data = data.data;
    } else {
      this.data = data;
    }
  }
}

export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    this.logger.log('Interceptor');
    return next.handle().pipe(map(data => new ResponseSuccess(data)));
  }
}
