import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import {
  GetAnswerInputDto,
  GetAnswerOutputDto,
  GetAnswersInputDto,
  GetAnswersOutputDto,
} from './dtos/get-answer.dto';
import {
  CreateAnswerInputDto,
  CreateAnswerOutputDto,
} from './dtos/create-answer.dto';
import {
  UpdateAnswerInputDto,
  UpdateAnswerOutputDto,
} from './dtos/update-answer.dto';
import {
  DeleteAnswerInputDto,
  DeleteAnswerOutputDto,
} from './dtos/delete-answer.dto';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => CreateAnswerOutputDto)
  async createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInputDto,
  ): Promise<CreateAnswerOutputDto> {
    return await this.answerService.create(createAnswerInput);
  }

  @Query(() => GetAnswerOutputDto)
  async getAnswer(
    @Args('getAnswerInput') getAnswerInput: GetAnswerInputDto,
  ): Promise<GetAnswerOutputDto> {
    return await this.answerService.findOne(getAnswerInput);
  }

  @Query(() => GetAnswersOutputDto)
  async getAnswers(
    @Args('getAnswersInput') getAnswersInput: GetAnswersInputDto,
  ): Promise<GetAnswersOutputDto> {
    return await this.answerService.findAll(getAnswersInput);
  }

  @Mutation(() => UpdateAnswerOutputDto)
  async updateAnswer(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInputDto,
  ): Promise<UpdateAnswerOutputDto> {
    return await this.answerService.update(updateAnswerInput);
  }

  @Mutation(() => DeleteAnswerOutputDto)
  async deleteAnswer(
    @Args('deleteAnswerInput') deleteAnswerInput: DeleteAnswerInputDto,
  ): Promise<DeleteAnswerOutputDto> {
    return await this.answerService.delete(deleteAnswerInput);
  }

  // 추가적인 설문지 완료와 확인 로직은 비즈니스 요구사항에 따라 구현
}
