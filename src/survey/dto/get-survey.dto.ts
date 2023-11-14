import { InputType, Field, PickType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { Survey } from '../entities/survey.entity';
import { SurveyType } from '../types/survey.type';
import { IsOptional } from 'class-validator';
import { SurveyDTO } from './survey.dto';

@InputType()
export class GetSurveyInputDto extends PickType(SurveyType, ['id']) {}

export class GetSurveyOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  surveyDto?: SurveyDTO;
}

export class GetSurveysOutputDto extends CoreOutPut {
  @Field(() => [Survey], { nullable: true })
  @IsOptional()
  surveyDtos?: SurveyDTO[];
}
