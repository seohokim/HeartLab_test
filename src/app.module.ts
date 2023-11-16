import { Module } from '@nestjs/common';
import { SurveyModule } from './survey/survey.module';
import { QuestionModule } from './question/question.module';
import { OptionModule } from './option/option.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AnswerModule } from './answer/answer.module';

@Module({
  imports: [
    SurveyModule,
    QuestionModule,
    OptionModule,
    TypeOrmModule.forRoot(typeORMConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gpl',
    }),
    AnswerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
