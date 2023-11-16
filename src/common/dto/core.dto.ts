import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutPut {
  @Field(() => Boolean, { nullable: false })
  ok: boolean;

  @Field(() => [String], { nullable: 'itemsAndList' })
  message?: string[];
}

@ObjectType()
export class CoreDTO {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
