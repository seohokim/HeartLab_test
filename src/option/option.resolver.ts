import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import {
  CreateOptionInputDto,
  CreateOptionOutputDto,
} from './dtos/create-option.dto';
import { OptionService } from './option.service';
import { OptionType } from './types/option.type';
import { GetOptionInputDto, GetOptionOutputDto } from './dtos/get-option.dto';
import {
  UpdateOptionInputDto,
  UpdateOptionOutputDto,
} from './dtos/update-option.dto';
import {
  DeleteOptionInputDto,
  DeleteOptionOutputDto,
} from './dtos/delete-option.dto';

@Resolver((of) => OptionType)
export class OptionResolver {
  constructor(private optionService: OptionService) {}

  @Query((returns) => GetOptionOutputDto)
  async getOption(
    @Args('getOptionInput') getOptionInput: GetOptionInputDto,
  ): Promise<GetOptionOutputDto> {
    return this.optionService.findOne(getOptionInput);
  }

  @Mutation((returns) => CreateOptionOutputDto)
  async createOption(
    @Args('createOptionInput') createOptionInputDto: CreateOptionInputDto,
  ): Promise<CreateOptionOutputDto> {
    return this.optionService.create(createOptionInputDto);
  }

  @Mutation((returns) => UpdateOptionOutputDto)
  async updateOption(
    @Args('updateOptionInput') updateOptionInput: UpdateOptionInputDto,
  ): Promise<UpdateOptionOutputDto> {
    return this.optionService.update(updateOptionInput);
  }

  @Mutation((returns) => DeleteOptionOutputDto)
  async deleteOption(
    @Args('deleteOptionInput') deleteOptionInput: DeleteOptionInputDto,
  ): Promise<DeleteOptionOutputDto> {
    return this.optionService.delete(deleteOptionInput);
  }

  // 기타 필요한 Query와 Mutation 추가
}
