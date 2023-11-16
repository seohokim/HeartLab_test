import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { OptionService } from './option.service';
import { OptionResolver } from './option.resolver';
import { Survey } from '../survey/entities/survey.entity';
import { Question } from '../question/entities/question.entity';
import { SurveyService } from '../survey/survey.service';

@Module({
  imports: [TypeOrmModule.forFeature([Option, Survey, Question])],
  providers: [OptionService, OptionResolver, SurveyService],
})
export class OptionModule {}
