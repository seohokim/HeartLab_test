import { ObjectType, Field, Int } from '@nestjs/graphql';
import { QuestionType } from 'src/question/types/question.type';

@ObjectType()
export class SurveyType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [QuestionType], { nullable: true })
  questions?: QuestionType[];
}
