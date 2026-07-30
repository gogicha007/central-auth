import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.types';
import { AuthSession, getSessionForAuth } from '../auth-session-cache.util';
import { RedisService } from '../../redis/redis.service';
import { SessionsService } from '../../sessions/sessions.service';
import { isSessionActive } from '../../common/utils/session-helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly sessionService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const session: null | AuthSession | undefined = await getSessionForAuth(
      this.redisService,
      this.sessionService,
      payload.sid,
    );

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    if (session.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid session');
    }

    const isValidSession = isSessionActive(session);
    if (!isValidSession) {
      throw new UnauthorizedException('User not authorized');
    }

    return {
      id: payload.sub,
      email: payload.email,
      sessionId: payload.sid,
      isPlatformAdmin: payload.isPlatformAdmin
    };
  }
}
