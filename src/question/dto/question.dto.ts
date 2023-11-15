import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { OptionDTO } from '../../option/dto/option.dto';

export class QuestionDTO {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  @IsNotEmpty()
  questionOrder: number;

  @IsOptional()
  options?: OptionDTO[];

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
