import { InputType, Field, PickType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Survey } from '../entities/survey.entity';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyType } from '../types/survey.type';

@InputType()
export class UpdateSurveyInputDto extends PickType(SurveyType, ['id']) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  changedTitle?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  changedDescription?: string;
}

export class UpdateSurveyOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  survey?: Survey;
}
