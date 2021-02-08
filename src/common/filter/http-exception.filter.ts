import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';

interface ErrorResponse {
  error: boolean;
  status: number;
  path: string;
  method: string;
  title: string;
  message: any;
  timestamp: string;
  stack?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const DEFAULT = 'Ocorreu um erro ao processar a solicitação.';
    const RESOURCE_NOT_FOUND = 'Ocorreu um erro ao procurar algum registro.';
    const BAD_REQUEST = 'Ocorreu um erro ao validar algum registro.';
    const UNAUTHORIZED = 'Ocorreu um erro ao buscar o usuário autenticado.';
    const FORBIDDEN = 'Acesso negado.';
    const TIMEOUT = 'Tempo limite para atender a solicitação foi alcançado.';
    const CONFLICT = 'Ocorreu um conflito interno no sistema';

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.url;
    const method = request.method;
    const eException: any = exception;
    const status = exception.getStatus();

    let title: string;
    let message =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? eException.response.message ||
          eException.response.message.error ||
          eException.response.message.message ||
          null
        : 'Erro interno no servidor';

    switch (true) {
      case exception instanceof NotFoundException:
        title = RESOURCE_NOT_FOUND;
        message = 'Recurso não encontrado ou o parâmetro é inválido.';
        break;
      case exception instanceof BadRequestException:
        title = BAD_REQUEST;
        break;
      case exception instanceof UnauthorizedException:
        title = UNAUTHORIZED;
        message = 'Você não está autenticado no sistema.';
        break;
      case exception instanceof ForbiddenException:
        title = FORBIDDEN;
        message = 'Você não está autorizado para acessar este recurso.';
        break;
      case exception instanceof RequestTimeoutException:
        title = TIMEOUT;
        break;
      case exception instanceof ConflictException:
        title = CONFLICT;
        break;
      default:
        title = DEFAULT;
        break;
    }
    const errorResponse: ErrorResponse = {
      error: true,
      status,
      path,
      method,
      title,
      message,
      timestamp: new Date().toISOString(),
      // stack: !environment.production ? exception.stack : null,
      // stack: null,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(`${method} ${path}`, exception.stack, 'HttpExceptionFilter');
    } else {
      Logger.error(
        `${method} ${path}`,
        JSON.stringify(errorResponse),
        'HttpExceptionFilter',
      );
    }
    response.status(status).json(errorResponse);
  }
}
