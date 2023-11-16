import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import {
  CreateQuestionInputDto,
  CreateQuestionOutputDto,
} from './dtos/create-question.dto';
import {
  handleErrorResponse,
  generateOkResponse,
} from '../common/utils/response.util';
import { Survey } from '../survey/entities/survey.entity';
import {
  UpdateQuestionInputDto,
  UpdateQuestionOutputDto,
} from './dtos/update-question.dto';
import {
  DeleteQuestionInputDto,
  DeleteQuestionOutputDto,
} from './dtos/delete-question.dto';
import {
  GetQuestionInputDto,
  GetQuestionOutputDto,
} from './dtos/get-question.dto';
import {
  QuestionNotFoundError,
  SurveyNotFoundError,
} from '../common/error/error.class';
import { QuestionDTO } from './dtos/question.dto';
import { OptionDTO } from '../option/dtos/option.dto';
import { SurveyService } from '../survey/survey.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    private readonly surveyService: SurveyService,
  ) {}

  // create 메서드
  async create(
    createQuestionInput: CreateQuestionInputDto,
  ): Promise<CreateQuestionOutputDto> {
    try {
      await this.createQuestion(createQuestionInput);
      const survey = await this.surveyService.findSurveyById(
        createQuestionInput.surveyId,
      );
      const surveyDto = this.surveyService.toSurveyDto(survey);
      return generateOkResponse<CreateQuestionOutputDto>({
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<CreateQuestionOutputDto>(
        error,
        'QuestionService.create',
      );
    }
  }

  // read 메서드
  async findOne(
    getQuestionInputDto: GetQuestionInputDto,
  ): Promise<GetQuestionOutputDto> {
    try {
      const question = await this.findQuestion(
        getQuestionInputDto.surveyId,
        getQuestionInputDto.questionOrder,
      );
      const questionDto = this.toQuestionDto(question);
      return generateOkResponse<GetQuestionOutputDto>({
        questionDto,
      });
    } catch (error) {
      return handleErrorResponse<GetQuestionOutputDto>(
        error,
        'QuestionService.findOne',
      );
    }
  }

  // update 메서드
  async update(
    updateQuestionInputDto: UpdateQuestionInputDto,
  ): Promise<UpdateQuestionOutputDto> {
    try {
      await this.updateQuestion(updateQuestionInputDto);
      const survey = await this.surveyService.findSurveyById(
        updateQuestionInputDto.surveyId,
      );
      const surveyDto = this.surveyService.toSurveyDto(survey);
      return generateOkResponse<UpdateQuestionOutputDto>({
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<UpdateQuestionOutputDto>(
        error,
        'QuestionService.update',
      );
    }
  }

  // delete 메서드
  async delete(
    deleteQuestionInputDto: DeleteQuestionInputDto,
  ): Promise<DeleteQuestionOutputDto> {
    try {
      const updatedSurvey = await this.deleteQuestion(deleteQuestionInputDto);
      const surveyDto = this.surveyService.toSurveyDto(updatedSurvey);
      return generateOkResponse<DeleteQuestionOutputDto>({
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<DeleteQuestionOutputDto>(
        error,
        'QuestionService.delete',
      );
    }
  }

  async createQuestion(
    createQuestionInput: CreateQuestionInputDto,
  ): Promise<Question> {
    const survey = await this.surveyRepository.findOne({
      where: { id: createQuestionInput.surveyId },
      relations: ['questions', 'questions.options'],
    });

    if (!survey) {
      throw new SurveyNotFoundError('Survey not found');
    }

    survey.questions.sort((a, b) => a.questionOrder - b.questionOrder);

    let newQuestionOrder = createQuestionInput.questionOrder;
    // 새로운 질문을 마지막에 삽입하는 경우
    if (newQuestionOrder > survey.questions.length) {
      newQuestionOrder = survey.questions.length + 1;
    } else {
      // 새로운 질문을 중간에 삽입하는 경우
      for (let question of survey.questions) {
        if (question.questionOrder >= newQuestionOrder) {
          question.questionOrder += 1;
          await this.questionRepository.save(question);
        }
      }
    }

    const question = new Question();
    question.questionText = createQuestionInput.questionText;
    question.survey = survey;
    question.questionOrder = newQuestionOrder;

    await this.questionRepository.save(question);

    // survey에 question 추가 및 저장
    survey.questions.push(question);
    await this.surveyRepository.save(survey);

    return question;
  }

  async deleteQuestion(
    deleteQuestionInputDto: DeleteQuestionInputDto,
  ): Promise<Survey> {
    const question = await this.findQuestion(
      deleteQuestionInputDto.surveyId,
      deleteQuestionInputDto.questionOrder,
    );
    await this.questionRepository.remove(question);

    const survey = await this.surveyRepository.findOne({
      where: { id: deleteQuestionInputDto.surveyId },
      relations: ['questions', 'questions.options'],
    });
    if (!survey) {
      throw new SurveyNotFoundError('Survey not found after question deletion');
    }
    // 질문 순서 재조정
    for (let q of survey.questions) {
      if (q.questionOrder > question.questionOrder) {
        q.questionOrder--;
        await this.questionRepository.save(q);
      }
    }
    await this.surveyRepository.save(survey);
    return await this.surveyRepository.findOne({
      where: { id: survey.id },
      relations: ['questions', 'questions.options'],
    });
  }

  async updateQuestion(
    updateQuestionInputDto: UpdateQuestionInputDto,
  ): Promise<Question> {
    const question = await this.findQuestion(
      updateQuestionInputDto.surveyId,
      updateQuestionInputDto.questionOrder,
    );

    question.questionText = updateQuestionInputDto.chaingedText;
    await this.questionRepository.save(question);
    return question;
  }

  async findQuestion(
    surveyId: number,
    questionOrder: number,
  ): Promise<Question> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['questions', 'questions.options'],
    });

    if (!survey) {
      throw new SurveyNotFoundError('Survey not found');
    }

    const question = survey.questions.find(
      (q) => q.questionOrder === questionOrder,
    );
    if (!question) {
      throw new QuestionNotFoundError('Question not found');
    }

    return question;
  }

  toQuestionDto(questionEntity: Question): QuestionDTO {
    const { options } = questionEntity;
    let optionDtos: OptionDTO[] = [];
    if (options) {
      optionDtos = options
        .map((option) => {
          return {
            optionText: option.optionText,
            optionOrder: option.optionOrder,
            score: option.score,
            createdAt: option.createdAt,
            updatedAt: option.updatedAt,
          };
        })
        .sort((a, b) => a.optionOrder - b.optionOrder);
    }
    return {
      questionText: questionEntity.questionText,
      questionOrder: questionEntity.questionOrder,
      createdAt: questionEntity.createdAt,
      updatedAt: questionEntity.updatedAt,
      options: optionDtos,
    };
  }
}
