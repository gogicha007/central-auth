import { Injectable } from '@nestjs/common';
import { CreateHealthDto } from './dto/create-health.dto';
import { UpdateHealthDto } from './dto/update-health.dto';

@Injectable()
export class HealthService {
  live() {
    return 'This action adds a new health';
  }

  ready() {
    return `This action returns all health`;
  }
}
