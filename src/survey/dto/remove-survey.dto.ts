import { Field, InputType, PickType } from '@nestjs/graphql';
import { Survey } from '../entities/survey.entity';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyType } from '../types/survey.type';

@InputType()
export class RemoveSurveyInputDto extends PickType(SurveyType, ['id']) {}

export class RemoveSurveyOutputDto extends CoreOutPut {
  @Field({ nullable: true })
  survey?: Survey;
}
