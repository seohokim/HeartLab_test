import { Field, InputType, PickType } from '@nestjs/graphql';
import { Survey } from '../entities/survey.entity';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyType } from '../types/survey.type';
import { IsOptional } from 'class-validator';
import { SurveyDTO } from './survey.dto';

@InputType()
export class DeleteSurveyInputDto extends PickType(SurveyType, ['id']) {}

export class DeleteSurveyOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  @IsOptional()
  surveyDto?: SurveyDTO;
}
