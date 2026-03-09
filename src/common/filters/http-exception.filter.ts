import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = (exception as any).message || 'Internal server error';
    
    // ValidationPipe에서 발생한 에러 메시지 처리
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || message;
      }
    }

    // 에러 추적용 로그
    this.logger.error(
      `Http Status: ${status}, Message: ${JSON.stringify(message)}`,
      (exception as any).stack,
    );

    response
      .status(status)
      .json({
        success: false,
        message: Array.isArray(message) ? message[0] : message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}