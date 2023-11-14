import { QuestionDTO } from '../../question/dto/question.dto';
import { Core } from '../../common/entities/core.entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SurveyDTO extends Core {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  questions?: QuestionDTO[];
}
