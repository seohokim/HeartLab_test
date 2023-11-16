import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { QuestionType } from './types/question.type';
import {
  CreateQuestionInputDto,
  CreateQuestionOutputDto,
} from './dtos/create-question.dto';
import {
  UpdateQuestionInputDto,
  UpdateQuestionOutputDto,
} from './dtos/update-question.dto';
import {
  GetQuestionInputDto,
  GetQuestionOutputDto,
} from './dtos/get-question.dto';
import {
  DeleteQuestionInputDto,
  DeleteQuestionOutputDto,
} from './dtos/delete-question.dto';

@Resolver((of) => QuestionType)
export class QuestionResolver {
  constructor(private questionService: QuestionService) {}

  @Query((returns) => GetQuestionOutputDto)
  async getQuestion(
    @Args('getQuestionInput') getQuestionInput: GetQuestionInputDto,
  ): Promise<GetQuestionOutputDto> {
    return this.questionService.findOne(getQuestionInput);
  }

  @Mutation((returns) => CreateQuestionOutputDto)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInputDto,
  ): Promise<CreateQuestionOutputDto> {
    return this.questionService.create(createQuestionInput);
  }

  @Mutation((returns) => UpdateQuestionOutputDto)
  async updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInputDto,
  ): Promise<UpdateQuestionOutputDto> {
    return this.questionService.update(updateQuestionInput);
  }

  @Mutation((returns) => DeleteQuestionOutputDto)
  async deleteQuestion(
    @Args('deleteQuestionInput') deleteQuestionInput: DeleteQuestionInputDto,
  ): Promise<DeleteQuestionOutputDto> {
    return this.questionService.delete(deleteQuestionInput);
  }
}
