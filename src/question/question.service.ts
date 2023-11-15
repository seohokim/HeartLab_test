import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import {
  CreateQuestionInputDto,
  CreateQuestionOutputDto,
} from './dto/create-question.dto';
import {
  handleErrorResponse,
  generateOkResponse,
} from '../common/utils/response.util';
import { Survey } from '../survey/entities/survey.entity';
import {
  UpdateQuestionInputDto,
  UpdateQuestionOutputDto,
} from './dto/update-question.dto';
import {
  DeleteQuestionInputDto,
  DeleteQuestionOutputDto,
} from './dto/delete-question.dto';
import {
  GetQuestionInputDto,
  GetQuestionOutputDto,
} from './dto/get-question.dto';
import {
  QuestionNotFoundError,
  SurveyNotFoundError,
} from '../common/error/error.class';
import { QuestionDTO } from './dto/question.dto';
import { OptionDTO } from '../option/dto/option.dto';
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
      return generateOkResponse<CreateQuestionOutputDto>(200, {
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<CreateQuestionOutputDto>(
        error,
        'QuestionService.create',
      );
    }
  }

  private async createQuestion(
    createQuestionInput: CreateQuestionInputDto,
  ): Promise<Question> {
    const survey = await this.surveyRepository.findOne({
      where: { id: createQuestionInput.surveyId },
      relations: ['questions'],
    });

    if (!survey) {
      throw new SurveyNotFoundError('Survey not found');
    }

    const question = new Question();
    question.text = createQuestionInput.text;
    question.survey = survey;
    question.questionOrder = survey.questions.length + 1;

    await this.questionRepository.save(question);
    return question;
  }

  // findOne 메서드
  async questionFindOne(
    getQuestionInputDto: GetQuestionInputDto,
  ): Promise<GetQuestionOutputDto> {
    try {
      const question = await this.findQuestion(
        getQuestionInputDto.surveyId,
        getQuestionInputDto.questionOrder,
      );
      const questionDto = this.toQuestionDto(question);
      return generateOkResponse<GetQuestionOutputDto>(200, {
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
      return generateOkResponse<UpdateQuestionOutputDto>(200, {
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
      console.log(surveyDto.questions);
      return generateOkResponse<DeleteQuestionOutputDto>(200, {
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<DeleteQuestionOutputDto>(
        error,
        'QuestionService.delete',
      );
    }
  }

  private async deleteQuestion(
    deleteQuestionInputDto: DeleteQuestionInputDto,
  ): Promise<Survey> {
    const question = await this.findQuestion(
      deleteQuestionInputDto.surveyId,
      deleteQuestionInputDto.questionOrder,
    );
    await this.questionRepository.remove(question);
    const survey = await this.surveyRepository.findOne({
      where: { id: deleteQuestionInputDto.surveyId },
      relations: ['questions'],
    });

    if (!survey) {
      throw new SurveyNotFoundError('Survey not found after question deletion');
    }
    // 질문 순서 재조정
    survey.questions.forEach((q) => {
      if (q.questionOrder > question.questionOrder) {
        q.questionOrder--;
      }
    });
    await this.surveyRepository.save(survey.questions);
    return await this.surveyRepository.findOne({
      where: { id: survey.id },
      relations: ['questions'],
    });
  }

  private async updateQuestion(
    updateQuestionInputDto: UpdateQuestionInputDto,
  ): Promise<Question> {
    const question = await this.findQuestion(
      updateQuestionInputDto.surveyId,
      updateQuestionInputDto.questionOrder,
    );

    question.text = updateQuestionInputDto.text;
    await this.questionRepository.save(question);
    return question;
  }

  private async findQuestion(
    surveyId: number,
    questionOrder: number,
  ): Promise<Question> {
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['questions'],
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

  private toQuestionDto(questionEntity: Question): QuestionDTO {
    const { options } = questionEntity;
    let optionDtos: OptionDTO[] = [];
    if (options) {
      optionDtos = options.map((option) => {
        return {
          text: option.text,
          optionOrder: option.optionOrder,
          score: option.score,
          createdAt: option.createdAt,
          updatedAt: option.updatedAt,
        };
      });
    }
    return {
      text: questionEntity.text,
      questionOrder: questionEntity.questionOrder,
      createdAt: questionEntity.createdAt,
      updatedAt: questionEntity.updatedAt,
      options: optionDtos,
    };
  }
}
