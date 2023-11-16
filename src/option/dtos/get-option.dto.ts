import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { OptionDTO } from './option.dto';

@InputType()
export class GetOptionInputDto {
  @Field(() => Int)
  optionOrder: number;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  surveyId: number;
}

@ObjectType()
export class GetOptionOutputDto extends CoreOutPut {
  @Field(() => OptionDTO, { nullable: true })
  optionDto?: OptionDTO;
}
