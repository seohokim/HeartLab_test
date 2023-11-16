import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { SurveyService } from '../survey/survey.service';
import { OptionService } from '../option/option.service';
import { AnswerService } from './answer.service';
import { AnswerResolver } from './answer.resolver';
import { Survey } from '../survey/entities/survey.entity';
import { Option } from '../option/entities/option.entity';
import { Question } from '../question/entities/question.entity';
import { QuestionService } from '../question/question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Survey, Option, Question])],
  providers: [
    AnswerService,
    AnswerResolver,
    SurveyService,
    QuestionService,
    OptionService,
  ],
})
export class AnswerModule {}
