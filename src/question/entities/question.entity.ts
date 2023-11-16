import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Core } from '../../common/entity/core.entity';
import { Option } from '../../option/entities/option.entity';
import { Survey } from '../../survey/entities/survey.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Question extends Core {
  @Column({ nullable: false })
  @IsString()
  questionText: string;

  @Column({ nullable: false })
  @IsNumber()
  questionOrder: number;

  @ManyToOne(() => Survey, (survey) => survey.questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @IsNotEmpty()
  survey: Survey;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: true,
    nullable: true,
  })
  options: Option[];
}
