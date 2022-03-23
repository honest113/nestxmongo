import { Logger, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

function buildingRequestLog(request: Request): string {
  const param = `\n param: ${JSON.stringify(request.params)}`;
  const query = `\n query: ${JSON.stringify(request.query)}`;
  const body =
    request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH'
      ? `\n body: ${JSON.stringify(request.body)}`
      : '';
  return `[${request.method} - ${request.baseUrl}]: ${param} ${query} ${body}`;
}

export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpLoggerMiddleware.name);

  use(req: any, res: any, next: (error?: any) => void) {
    this.logger.log(buildingRequestLog(req));
    next();
  }
}
