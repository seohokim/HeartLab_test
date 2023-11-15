import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OptionType } from '../../option/types/option.type';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class QuestionType {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => Int)
  @IsInt()
  questionOrder: number;

  @Field(() => Int)
  @IsInt()
  surveyId: number;

  @Field(() => [OptionType], { nullable: true })
  @IsOptional()
  options?: OptionType[];
}
