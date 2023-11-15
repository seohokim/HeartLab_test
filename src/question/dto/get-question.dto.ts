import { Field, PickType } from '@nestjs/graphql';
import { QuestionType } from '../types/question.type';
import { CoreOutPut } from '../../common/dto/core.dto';
import { IsOptional } from 'class-validator';
import { QuestionDTO } from './question.dto';

export class GetQuestionInputDto extends PickType(QuestionType, [
  'surveyId',
  'questionOrder',
]) {}

export class GetQuestionOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  @IsOptional()
  questionDto?: QuestionDTO;
}
