import { IsNumber } from 'class-validator';
import { Core } from 'src/common/entities/core.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Response extends Core {
  @Column('int', { array: true })
  @IsNumber()
  selectedOptions: number[];

  @Column()
  @IsNumber()
  totalScore: number;

  @ManyToOne(() => Survey)
  survey: Survey;
}
