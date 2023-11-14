import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Core } from '../../common/entities/core.entity';

import { Column, Entity, OneToMany } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { QuestionDTO } from 'src/question/dto/question.dto';

@Entity()
export class Survey extends Core {
  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @OneToMany(() => Question, (question) => question.survey, {
    cascade: ['remove'], // 삭제 시 하위 엔티티들도 함께 삭제
    nullable: true,
  })
  @IsOptional()
  questions?: Question[];
}

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
