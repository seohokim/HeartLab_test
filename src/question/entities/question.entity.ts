import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Core } from '../../common/entities/core.entity';
import { Option } from '../../option/entities/option.entity';
import { Survey } from '../../survey/entities/survey.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Question extends Core {
  @Column({ nullable: false })
  @IsString()
  text: string;

  @Column({ nullable: false })
  @IsNumber()
  questionOrder: number;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  @IsNotEmpty()
  survey: Survey;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: ['remove'], // 삭제 시 하위 엔티티들도 함께 삭제
    nullable: true,
  })
  options: Option[];
}
