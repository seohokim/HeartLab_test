import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';

@InputType()
export class DeleteSurveyInputDto {
  @Field(() => Int)
  surveyId: number;
}

@ObjectType()
export class DeleteSurveyOutputDto extends CoreOutPut {}
