import { InputType, Field, Int, PickType } from '@nestjs/graphql';
import { QuestionType } from '../types/question.type';
import { CoreOutPut } from '../../common/dto/core.dto';
import { IsOptional } from 'class-validator';
import { SurveyDTO } from '../../survey/entities/survey.entity';

@InputType()
export class CreateQuestionInputDto extends PickType(QuestionType, ['text']) {
  @Field(() => Int)
  surveyId: number;
}

export class CreateQuestionOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  @IsOptional()
  surveyDto?: SurveyDTO;
}
