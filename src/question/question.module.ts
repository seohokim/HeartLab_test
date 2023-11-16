import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { Survey } from 'src/survey/entities/survey.entity';
import { SurveyService } from '../survey/survey.service';
import { Answer } from '../answer/entities/answer.entity';
import { Option } from '../option/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Survey, Option, Answer])],
  providers: [QuestionService, QuestionResolver, SurveyService],
})
export class QuestionModule {}
