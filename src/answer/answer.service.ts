import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import {
  GetAnswerInputDto,
  GetAnswerOutputDto,
  GetAnswersInputDto,
  GetAnswersOutputDto,
} from './dtos/get-answer.dto';
import {
  generateOkResponse,
  handleErrorResponse,
} from '../common/utils/response.util';
import {
  AnswerNotFoundError,
  SurveyNotFoundError,
} from '../common/error/error.class';
import { Option } from '../option/entities/option.entity';
import { SelectedOptionDTO } from '../option/dtos/selected-option.dto';
import { AnswerDTO } from './dtos/answer.dto';
import { SurveyService } from '../survey/survey.service';
import {
  CreateAnswerInputDto,
  CreateAnswerOutputDto,
} from './dtos/create-answer.dto';
import { OptionService } from '../option/option.service';
import {
  UpdateAnswerInputDto,
  UpdateAnswerOutputDto,
} from './dtos/update-answer.dto';
import {
  DeleteAnswerInputDto,
  DeleteAnswerOutputDto,
} from './dtos/delete-answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    private readonly surveyService: SurveyService,
    private readonly optionService: OptionService,
  ) {}

  // read 메서드
  async findOne(
    getAnswerInput: GetAnswerInputDto,
  ): Promise<GetAnswerOutputDto> {
    try {
      const answer = await this.findAnswer(getAnswerInput.answerId);
      const answerDto = await this.toAnswerDto(answer);
      return generateOkResponse<GetAnswerOutputDto>({
        answerDto,
      });
    } catch (error) {
      return handleErrorResponse<GetAnswerOutputDto>(
        error,
        'AnswerService.findOne',
      );
    }
  }

  // readAll 메서드 for a survey
  async findAll(
    getAnswersInput: GetAnswersInputDto,
  ): Promise<GetAnswersOutputDto> {
    try {
      const survey = await this.surveyService.findSurveyById(
        getAnswersInput.surveyId,
      );
      const answers = await this.answerRepository.find({
        where: { survey: { id: survey.id } },
        relations: ['survey', 'selectedOptions', 'selectedOptions.question'],
      });
      const answerDtos = await Promise.all(
        answers.map(async (answer) => {
          const answerDto = await this.toAnswerDto(answer);
          answerDto.totalScore = await this.calculateTotalScoreAndSave(answer);
          return answerDto;
        }),
      );
      return generateOkResponse<GetAnswersOutputDto>({
        answerDtos,
      });
    } catch (error) {
      return handleErrorResponse<GetAnswersOutputDto>(
        error,
        'AnswerService.findAll',
      );
    }
  }

  // create 메서드
  async create(
    createAnswerInput: CreateAnswerInputDto,
  ): Promise<CreateAnswerOutputDto> {
    try {
      const answer = await this.createAnswer(createAnswerInput);
      const answerDto = await this.toAnswerDto(answer);
      answerDto.totalScore = await this.calculateTotalScoreAndSave(answer);
      answerDto.id = answer.id;
      answerDto.selectedOptionDtos = await this.toSelectedOptionDtos(
        answer.selectedOptions,
      );

      // sorting
      answerDto.selectedOptionDtos.sort(
        (a, b) => a.questionOrder - b.questionOrder,
      );
      answerDto.remainedQuestionDtos.sort(
        (a, b) => a.questionOrder - b.questionOrder,
      );
      return generateOkResponse<CreateAnswerOutputDto>({
        answerDto,
      });
    } catch (error) {
      return handleErrorResponse<CreateAnswerOutputDto>(
        error,
        'AnswerService.create',
      );
    }
  }

  // update 메서드
  async update(
    updateAnswerInput: UpdateAnswerInputDto,
  ): Promise<UpdateAnswerOutputDto> {
    try {
      const answer = await this.updateAnswer(updateAnswerInput);
      const answerDto = await this.toAnswerDto(answer);
      answerDto.totalScore = await this.calculateTotalScoreAndSave(answer);

      // sorting
      answerDto.selectedOptionDtos.sort(
        (a, b) => a.questionOrder - b.questionOrder,
      );
      answerDto.remainedQuestionDtos.sort(
        (a, b) => a.questionOrder - b.questionOrder,
      );
      return generateOkResponse<UpdateAnswerOutputDto>({
        answerDto,
      });
    } catch (error) {
      return handleErrorResponse<UpdateAnswerOutputDto>(
        error,
        'AnswerService.update',
      );
    }
  }

  //delete 메서드
  async delete(
    deleteAnswerInput: DeleteAnswerInputDto,
  ): Promise<DeleteAnswerOutputDto> {
    try {
      const answer = await this.findAnswer(deleteAnswerInput.answerId);
      await this.answerRepository.remove(answer);
      return generateOkResponse<DeleteAnswerOutputDto>();
    } catch (error) {
      return handleErrorResponse<DeleteAnswerOutputDto>(
        error,
        'AnswerService.delete',
      );
    }
  }

  // helper method
  async updateAnswer(updateAnswerInput: UpdateAnswerInputDto): Promise<Answer> {
    const { answerId, questionAndOptionOrders } = updateAnswerInput;
    const answer = await this.findAnswer(answerId);
    // questionAndOptionOrders: [[질문번호, 선택한 옵션번호], ...]
    for (let [a, b] of questionAndOptionOrders) {
      const option = await this.optionService.findOption(
        answer.survey.id,
        a,
        b,
      );
      // 이미 선택된 옵션이면 삭제
      const index = answer.selectedOptions.findIndex(
        (selectedOption) => selectedOption.question.questionOrder === a,
      );
      if (index !== -1) {
        answer.selectedOptions.splice(index, 1);
      }
      // 새로 선택한 옵션 추가
      answer.selectedOptions.push(option);
    }
    return answer;
  }

  // helper method
  async createAnswer(createAnswerInput: CreateAnswerInputDto): Promise<Answer> {
    const { surveyId, questionAndOptionOrders } = createAnswerInput;
    const answer = new Answer();
    answer.survey = await this.surveyService.findSurveyById(surveyId);
    answer.selectedOptions = [];
    // questionAndOptionOrders: [[질문번호, 선택한 옵션번호], ...]
    for (let [a, b] of questionAndOptionOrders) {
      const option = await this.optionService.findOption(
        answer.survey.id,
        a,
        b,
      );
      // 이미 선택된 옵션이면 삭제
      const index = answer.selectedOptions.findIndex(
        (selectedOption) => selectedOption.question.questionOrder === a,
      );
      if (index !== -1) {
        answer.selectedOptions.splice(index, 1);
      }
      // 새로 선택한 옵션 추가
      answer.selectedOptions.push(option);
    }
    return answer;
  }

  // helper method
  async findAnswer(id: number): Promise<Answer> {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['survey', 'selectedOptions', 'selectedOptions.question'],
    });
    if (!answer) {
      throw new AnswerNotFoundError('Answer Not Found');
    }
    return answer;
  }

  // helper method
  async toAnswerDto(answer: Answer): Promise<AnswerDTO> {
    // answer를 answerDto로 변환
    const answerDto = new AnswerDTO();
    answerDto.id = answer.id;
    answerDto.surveyDto = this.surveyService.toSurveyDto(answer.survey);
    answerDto.selectedOptionDtos = await this.toSelectedOptionDtos(
      answer.selectedOptions,
    );
    answerDto.selectedOptionDtos.sort(
      (a, b) => a.questionOrder - b.questionOrder,
    );

    // 전체 질문 가져오기
    const allQuestions = await this.getAllQuestions(answer.survey.id);
    // 이미 응답된 질문 식별
    const answeredQuestionIds = answer.selectedOptions.map(
      (option) => option.question.id,
    );

    // 응답되지 않은 질문 식별
    answerDto.remainedQuestionDtos = allQuestions.filter(
      (question) => !answeredQuestionIds.includes(question.id),
    );
    answerDto.remainedQuestionDtos.sort(
      (a, b) => a.questionOrder - b.questionOrder,
    );

    answerDto.createdAt = answer.createdAt;
    answerDto.updatedAt = answer.updatedAt;
    return answerDto;
  }

  // helper method
  async toSelectedOptionDtos(options: Option[]): Promise<SelectedOptionDTO[]> {
    // option을 selectedOptionDto로 변환
    const result = await Promise.all(
      options.map(async (option) => {
        const optionWithRelation = await this.optionRepository.findOne({
          where: { id: option.id },
          relations: ['question'],
        });
        const selectedOptionDto = new SelectedOptionDTO();
        selectedOptionDto.optionText = optionWithRelation.optionText;
        selectedOptionDto.questionText =
          optionWithRelation.question.questionText;
        selectedOptionDto.optionOrder = optionWithRelation.optionOrder;
        selectedOptionDto.questionOrder =
          optionWithRelation.question.questionOrder;
        selectedOptionDto.score = optionWithRelation.score;
        selectedOptionDto.createdAt = optionWithRelation.createdAt;
        selectedOptionDto.updatedAt = optionWithRelation.updatedAt;
        return selectedOptionDto;
      }),
    );
    return result;
  }

  // helper method
  async getAllQuestions(surveyId: number) {
    // 전체 질문 가져오기
    const survey = await this.surveyService.findSurveyById(surveyId);
    if (!survey) {
      throw new SurveyNotFoundError('Survey Not Found');
    }
    const questions = survey.questions;
    return questions;
  }

  // helper method
  async calculateTotalScoreAndSave(answer: Answer): Promise<number> {
    const answerDto = await this.toAnswerDto(answer);

    // 남아있는 질문이 없으면 총점 계산
    if (answerDto.remainedQuestionDtos.length === 0) {
      const totalScore = answer.selectedOptions.reduce((acc, cur) => {
        return acc + cur.score;
      }, 0);
      answer.totalScore = totalScore;
      const savedAnswer = await this.answerRepository.save(answer);
      answer.id = savedAnswer.id;
      return totalScore;
    }

    const savedAnswer = await this.answerRepository.save(answer);
    answer.id = savedAnswer.id;
    return null;
  }
}
