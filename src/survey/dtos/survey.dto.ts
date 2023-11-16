import { QuestionDTO } from '../../question/dtos/question.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { CoreDTO } from '../../common/dto/core.dto';

@ObjectType()
export class SurveyDTO extends CoreDTO {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => [QuestionDTO])
  questions?: QuestionDTO[];
}
