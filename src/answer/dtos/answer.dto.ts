import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SelectedOptionDTO } from '../../option/dtos/selected-option.dto';
import { SurveyDTO } from '../../survey/dtos/survey.dto';
import { CoreDTO } from '../../common/dto/core.dto';
import { QuestionDTO } from '../../question/dtos/question.dto';

@ObjectType()
export class AnswerDTO extends CoreDTO {
  @Field(() => [SelectedOptionDTO])
  selectedOptionDtos: SelectedOptionDTO[];

  @Field(() => [QuestionDTO])
  remainedQuestionDtos: QuestionDTO[];

  @Field(() => SurveyDTO)
  surveyDto: SurveyDTO;

  @Field(() => Int, { nullable: true })
  totalScore: number;
}
