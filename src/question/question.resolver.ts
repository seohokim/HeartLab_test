import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { QuestionType } from './types/question.type';
import {
  CreateQuestionInputDto,
  CreateQuestionOutputDto,
} from './dto/create-question.dto';
import {
  UpdateQuestionInputDto,
  UpdateQuestionOutputDto,
} from './dto/update-question.dto';
import {
  GetQuestionInputDto,
  GetQuestionOutputDto,
} from './dto/get-question.dto';
import {
  DeleteQuestionInputDto,
  DeleteQuestionOutputDto,
} from './dto/delete-question.dto';

@Resolver((of) => QuestionType)
export class QuestionResolver {
  constructor(private questionService: QuestionService) {}

  @Query((returns) => QuestionType)
  async question(
    @Args('getQuestionInput') getQuestionInput: GetQuestionInputDto,
  ): Promise<GetQuestionOutputDto> {
    return this.questionService.questionFindOne(getQuestionInput);
  }

  @Mutation((returns) => QuestionType)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInputDto,
  ): Promise<CreateQuestionOutputDto> {
    return this.questionService.create(createQuestionInput);
  }

  @Mutation((returns) => QuestionType)
  async updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInputDto,
  ): Promise<UpdateQuestionOutputDto> {
    return this.questionService.update(updateQuestionInput);
  }

  @Mutation((returns) => QuestionType)
  async removeQuestion(
    @Args('deleteQuestionInput') deleteQuestionInput: DeleteQuestionInputDto,
  ): Promise<DeleteQuestionOutputDto> {
    return this.questionService.delete(deleteQuestionInput);
  }
}
