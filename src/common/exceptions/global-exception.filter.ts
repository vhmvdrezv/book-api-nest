import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, HttpException } from "@nestjs/common";
import { AppLogger } from "../logger/app.logger";
import { Response } from "express";
import { Prisma } from "@prisma/client";

Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = "Internal Server Error";
    let isHandled = false;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
      isHandled = true;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Database error: ${exception.message}`;
      isHandled = true;
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = "Invalid database input";
      isHandled = true;
    }

   
    if (isHandled) {
      this.logger.warn(`Handled Exception: ${JSON.stringify(message)}`);
    } else {
      this.logger.error(
        "Unhandled Exception",
        JSON.stringify({ status, message, exception: exception.toString() })
      );
    }

    response.status(status).json({
      statusCode: status,
      message: typeof message === "string" ? message : message.message,
      timestamp: new Date().toISOString(),
    });
  }
}