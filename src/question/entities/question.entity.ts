import { IsString } from 'class-validator';
import { Core } from 'src/common/entities/core.entity';
import { Option } from 'src/option/entities/option.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Question extends Core {
  @Column()
  @IsString()
  text: string;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];
}
