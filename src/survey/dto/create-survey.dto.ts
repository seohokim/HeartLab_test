import { InputType, Field, PickType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { Survey } from '../entities/survey.entity';
import { SurveyType } from '../types/survey.type';

@InputType()
export class CreateSurveyInputDto extends PickType(SurveyType, [
  'title',
  'description',
]) {}

export class CreateSurveyOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  survey?: Survey;
}
