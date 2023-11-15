import { Field, PickType } from '@nestjs/graphql';
import { QuestionType } from '../types/question.type';
import { CoreOutPut } from '../../common/dto/core.dto';
import { IsOptional } from 'class-validator';
import { SurveyDTO } from '../../survey/entities/survey.entity';

export class DeleteQuestionInputDto extends PickType(QuestionType, [
  'surveyId',
  'questionOrder',
]) {}

export class DeleteQuestionOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  @IsOptional()
  surveyDto?: SurveyDTO;
}
