import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Core } from '../../common/entity/core.entity';
import { Question } from '../../question/entities/question.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { Answer } from '../../answer/entities/answer.entity';

@Entity()
export class Option extends Core {
  @Column()
  @IsString()
  optionText: string;

  @Column()
  @IsNumber()
  score: number;

  @Column({ nullable: false })
  @IsNumber()
  optionOrder: number;

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @IsNotEmpty()
  question: Question;

  @ManyToMany(() => Answer, (answer) => answer.selectedOptions, {
    cascade: true,
  })
  answers: Answer[];
}
