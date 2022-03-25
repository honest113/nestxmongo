import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
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
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map(data => new ResponseSuccess(data)));
  }
}
