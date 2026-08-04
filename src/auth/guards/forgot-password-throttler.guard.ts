import { Injectable } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerException,
  ThrottlerRequest,
  ThrottlerOptions,
} from '@nestjs/throttler';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@Injectable()
export class ForgotPasswordThrottlerGuard extends ThrottlerGuard {
  protected getTracker(
    req: Request,
    throttler?: ThrottlerOptions,
  ): Promise<string> {
    if (throttler?.name === 'emailStrict') {
      const body = req.body as ForgotPasswordDto | undefined;
      const email = (body?.email?.trim().toLowerCase() as string) || '';
      return Promise.resolve(`email:${email}`);
    }

    const rawForwardedFor = req.headers['x-forwarded-for'];

    const forwardedFor = Array.isArray(rawForwardedFor)
      ? rawForwardedFor[0]
      : rawForwardedFor;

    const ip = (req.ip as string) || forwardedFor || 'unknown-ip';

    return Promise.resolve(`id:${ip}`);
  }

  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    try {
      return await super.handleRequest(requestProps);
    } catch (err) {
      if (err instanceof ThrottlerException) {
        const response = requestProps.context
          .switchToHttp()
          .getResponse<Response>();

        response.status(200).json({
          statusCode: 200,
          message:
            'If an account exists with that email, a password reset link has been sent.',
        });

        return false;
      }
      throw err;
    }
  }
}
