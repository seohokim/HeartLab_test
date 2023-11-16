import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import {
  CreateOptionInputDto,
  CreateOptionOutputDto,
} from './dtos/create-option.dto';
import { SurveyService } from '../survey/survey.service';
import {
  generateOkResponse,
  handleErrorResponse,
} from '../common/utils/response.util';
import { Survey } from '../survey/entities/survey.entity';
import {
  OptionNotFoundError,
  QuestionNotFoundError,
  SurveyNotFoundError,
} from '../common/error/error.class';
import { Question } from '../question/entities/question.entity';
import { GetOptionInputDto, GetOptionOutputDto } from './dtos/get-option.dto';
import {
  UpdateOptionInputDto,
  UpdateOptionOutputDto,
} from './dtos/update-option.dto';
import {
  DeleteOptionInputDto,
  DeleteOptionOutputDto,
} from './dtos/delete-option.dto';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly surveyService: SurveyService,
  ) {}

  // read 메서드
  async findOne(
    getOptionInput: GetOptionInputDto,
  ): Promise<GetOptionOutputDto> {
    try {
      const option = await this.findOption(
        getOptionInput.surveyId,
        getOptionInput.questionOrder,
        getOptionInput.optionOrder,
      );
      return generateOkResponse<GetOptionOutputDto>({
        optionDto: option,
      });
    } catch (error) {
      return handleErrorResponse<GetOptionOutputDto>(
        error,
        'OptionService.findOne',
      );
    }
  }

  // create 메서드
  async create(
    createOptionInput: CreateOptionInputDto,
  ): Promise<CreateOptionOutputDto> {
    try {
      await this.createOption(createOptionInput);
      const survey = await this.surveyService.findSurveyById(
        createOptionInput.surveyId,
      );
      const surveyDto = this.surveyService.toSurveyDto(survey);
      return generateOkResponse<CreateOptionOutputDto>({
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<CreateOptionOutputDto>(
        error,
        'QuestionService.create',
      );
    }
  }

  // update 메서드
  async update(
    updateOptionInput: UpdateOptionInputDto,
  ): Promise<UpdateOptionOutputDto> {
    try {
      await this.updateQuestion(updateOptionInput);
      const survey = await this.surveyService.findSurveyById(
        updateOptionInput.surveyId,
      );
      const surveyDto = this.surveyService.toSurveyDto(survey);
      return generateOkResponse<UpdateOptionOutputDto>({
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<UpdateOptionOutputDto>(
        error,
        'OptionService.update',
      );
    }
  }

  // delete 메서드
  async delete(
    deleteOptionInput: DeleteOptionInputDto,
  ): Promise<DeleteOptionOutputDto> {
    try {
      const survey = await this.deleteOption(deleteOptionInput);
      const surveyDto = this.surveyService.toSurveyDto(survey);
      return generateOkResponse<DeleteOptionOutputDto>({
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<DeleteOptionOutputDto>(
        error,
        'OptionService.delete',
      );
    }
  }

  async deleteOption(deleteOptionInput: DeleteOptionInputDto): Promise<Survey> {
    const { surveyId, questionOrder, optionOrder } = deleteOptionInput;

    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
    });
    if (!survey) {
      throw new SurveyNotFoundError('Survey not found.');
    }

    const question = await this.questionRepository.findOne({
      where: { survey: { id: surveyId }, questionOrder: questionOrder },
      relations: ['options'],
    });
    if (!question) {
      throw new QuestionNotFoundError('Question not found.');
    }

    const option = await this.findOption(surveyId, questionOrder, optionOrder);
    if (!option) {
      throw new OptionNotFoundError('Option not found.');
    }

    await this.optionRepository.remove(option);
    question.options.sort((a, b) => a.optionOrder - b.optionOrder);
    for (let option of question.options) {
      if (option.optionOrder > optionOrder) {
        option.optionOrder -= 1;
        await this.optionRepository.save(option);
      }
    }

    return await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['questions', 'questions.options'],
    });
  }

  async updateQuestion(updateOptionInput: UpdateOptionInputDto): Promise<void> {
    const { surveyId, questionOrder, optionOrder, changedText, changedScore } =
      updateOptionInput;

    const option = await this.findOption(surveyId, questionOrder, optionOrder);
    if (changedText) {
      option.optionText = changedText;
    }
    if (changedScore) {
      option.score = changedScore;
    }
    await this.optionRepository.save(option);
  }

  async createOption(createOptionInput: CreateOptionInputDto): Promise<Option> {
    const { surveyId, questionOrder } = createOptionInput;

    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
    });
    if (!survey) {
      throw new SurveyNotFoundError('Survey not found.');
    }

    const question = await this.questionRepository.findOne({
      where: { survey: { id: surveyId }, questionOrder: questionOrder },
      relations: ['options'],
    });
    if (!question) {
      throw new QuestionNotFoundError('Question not found.');
    }
    question.options.sort((a, b) => a.optionOrder - b.optionOrder);
    let newOptionOrder = createOptionInput.optionOrder;
    // 새로운 옵션을 마지막에 삽입하는 경우
    if (newOptionOrder > question.options.length) {
      newOptionOrder = question.options.length + 1;
    } else {
      // 새로운 옵션을 중간에 삽입하는 경우
      for (let option of question.options) {
        if (option.optionOrder >= newOptionOrder) {
          option.optionOrder += 1;
          await this.optionRepository.save(option);
        }
      }
    }

    const option = new Option();
    option.optionText = createOptionInput.optionText;
    option.question = question;
    option.optionOrder = newOptionOrder;
    option.score = createOptionInput.score;
    await this.optionRepository.save(option);

    return option;
  }

  async findOption(
    surveyId: number,
    questionOrder: number,
    optionOrder: number,
  ): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: {
        question: { survey: { id: surveyId }, questionOrder: questionOrder },
        optionOrder: optionOrder,
      },
      relations: ['question'],
    });
    if (!option) {
      throw new OptionNotFoundError('Option not found.');
    }
    return option;
  }
}
