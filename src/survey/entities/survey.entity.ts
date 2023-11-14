import { IsString } from 'class-validator';
import { Core } from 'src/common/entities/core.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Survey extends Core {
  @Column()
  @IsString()
  title: string;

  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];
}
