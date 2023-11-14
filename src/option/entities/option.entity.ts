import { IsNumber, IsString } from 'class-validator';
import { Core } from 'src/common/entities/core.entity';
import { Question } from 'src/question/entities/question.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Option extends Core {
  @Column()
  @IsString()
  text: string;

  @Column()
  @IsNumber()
  score: number;

  @ManyToOne(() => Question, (question) => question.options)
  question: Question;
}
