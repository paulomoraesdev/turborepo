import { Controller, Get, UseGuards } from '@nestjs/common';
import type { IAnalyticsSummary } from '@turborepo/dtos';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(): IAnalyticsSummary {
    return this.analyticsService.getSummary();
  }
}
