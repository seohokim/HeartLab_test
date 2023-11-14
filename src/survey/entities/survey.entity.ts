import { IsNotEmpty, IsString } from 'class-validator';
import { Core } from '../../common/entities/core.entity';

import { Column, Entity, OneToMany } from 'typeorm';
import { Question } from '../../question/entities/question.entity';

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
  questions: Question[];
}
