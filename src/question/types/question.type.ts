import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OptionType } from '../../option/types/option.type';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class QuestionType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  text: string;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  surveyId: number;

  @Field(() => [OptionType], { nullable: true })
  options?: OptionType[];
}
