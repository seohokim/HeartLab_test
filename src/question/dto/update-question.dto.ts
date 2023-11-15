import { Field, PickType } from '@nestjs/graphql';
import { QuestionType } from '../types/question.type';
import { IsOptional } from 'class-validator';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from '../../survey/entities/survey.entity';

export class UpdateQuestionInputDto extends PickType(QuestionType, [
  'surveyId',
  'questionOrder',
  'text',
]) {}

export class UpdateQuestionOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  @IsOptional()
  surveyDto?: SurveyDTO;
}
