import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';
import { QuestionType } from '../../question/types/question.type';

@ObjectType()
export class SurveyType {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  description: string;

  @Field(() => [QuestionType], { nullable: true })
  questions?: QuestionType[];
}
