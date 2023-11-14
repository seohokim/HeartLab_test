import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { QuestionType } from '../../question/types/question.type';

@ObjectType()
export class SurveyType {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => [QuestionType], { nullable: true })
  questions?: QuestionType[];
}
