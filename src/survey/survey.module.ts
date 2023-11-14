import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { SurveyResolver } from './survey.resolver';
import { SurveyService } from './survey.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  providers: [SurveyService, SurveyResolver],
})
export class SurveyModule {}
