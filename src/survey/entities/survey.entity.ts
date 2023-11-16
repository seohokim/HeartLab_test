import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Core } from '../../common/entity/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { Answer } from '../../answer/entities/answer.entity';

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
    cascade: true,
    nullable: true,
  })
  @IsOptional()
  questions?: Question[];

  @OneToMany(() => Answer, (answer) => answer.survey, {
    cascade: true,
    nullable: true,
  })
  @IsOptional()
  answers?: Answer[];
}
