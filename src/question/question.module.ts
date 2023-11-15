import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { Survey } from 'src/survey/entities/survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Survey])],
  providers: [QuestionService, QuestionResolver],
})
export class QuestionModule {}
