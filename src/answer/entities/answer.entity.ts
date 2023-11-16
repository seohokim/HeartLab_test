import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Survey } from '../../survey/entities/survey.entity';
import { Option } from '../../option/entities/option.entity';
import { Core } from '../../common/entity/core.entity';
import { IsNumber } from 'class-validator';

@Entity()
export class Answer extends Core {
  @ManyToOne(() => Survey, (survey) => survey.answers, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  survey: Survey;

  @ManyToMany(() => Option, (option) => option.answers)
  @JoinTable()
  selectedOptions: Option[];

  @Column({ nullable: true })
  @IsNumber()
  totalScore: number;
}
