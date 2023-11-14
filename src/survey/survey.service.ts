import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInputDto } from './dto/create-surver.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  async create(createSurveyInput: CreateSurveyInputDto): Promise<Survey> {
    const survey = this.surveyRepository.create(createSurveyInput);
    return this.surveyRepository.save(survey);
  }

  async findOne(id: number): Promise<Survey> {
    return this.surveyRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
  }

  // 기타 CRUD 메소드 구현
}
