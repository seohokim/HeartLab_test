# Survey API Server

본 프로젝트는 GraphQL을 이용한 설문조사 API 서버 구축입니다.

## README Index

- [1. Project Environment](#project-environment)

- [2. Getting Started](#getting-started)

  
  <br/>

- [3. API Specification](#api-specification)

| [3.1 Survey](#survey)           | [3.2 Question](#question)         |     [3.3 Option](#option)     |                             [3.4 Answer](#answer) |
| ------------------------------- | :-------------------------------- | :---------------------------: | ------------------------------------------------: |
| [CreateSurvey](#createsurvey)   | [CreateQuestion](#createquestion) | [CreateOption](#createoption) |                     [CreateAnswer](#createanswer) |
| [GetSurvey](#getsurvey)         | [GetQuestion](#getquestion)       |    [GetOption](#getoption)    |                           [GetAnswer](#getanswer) |
| [GetAllSurveys](#getallsurveys) |                                   |                               | [GetAllAnswers<br/>OfSurvey](#getallanswersofsurvey) |
| [UpdateSurvey](#updatesurvey)   | [UpdateQuestion](#updatequestion) | [UpdateOption](#updateoption) |                     [UpdateAnswer](#updateanswer) |
| [DeleteSurvey](#deletesurvey)   | [DeleteQuestion](#deletequestion) | [DeleteOption](#deleteoption) |                     [DeleteAnswer](#deleteanswer) |


  <br/>


- [4. ER Diagram](#er-diagram)

- [5. File Tree](#file-tree)

# Project Environment

- NodeJS: v18.15.0
- TypeScript: v5.1.3
- NestJS: v10.0.0
- GraphQL: v16.8.1
- PostgreSQL: v14.9
- TypeORM: v0.3.17
- Winston v3.11.0

  <br/>

---

# Getting Started

```bash
$ git clone https://github.com/seohokim/HeartLab_test.git
```

  <br/>

## npm Install

npm package 설치

```bash
$ npm install
```

  <br/>

## DB Configuration

아래 config 파일을 참고하여 DB 설정을 완료해주세요

사용 DB: PostgreSQL

📜[`typeorm.config.ts`](https://github.com/seohokim/HeartLab_test/blob/main/src/config/typeorm.config.ts)

  <br/>

## Start

```bash
$ npm run start
```
  <br/>
    <br/>

# API Specification

API endpoint는 아래와 같습니다. 

(로컬에서 돌릴 경우)

```
http://localhost:4000/graphql
```

요청 Header는 아래와 같습니다.

```
Content-Type: application/json
```

  <br/>

# Survey

`Survey`에 관한 API입니다.

  <br/>

## CreateSurvey

참고:

_`questionOrder`는 하나의 survey 안에서의 순서 번호입니다_

_`optionOrder`는 하나의 question 안에서의 순서 번호입니다_

<br/>

survey 생성

query 예시:

```graphQL
mutation CreateSurveyOutputDto{
  createSurvey(createSurveyInput: { title: "취향 설문조사",
  description: "자신의 취향을 골라주세요." }) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```
  
  <br/>

## GetSurvey

`surveyId`에 해당하는 survey 가져오기

query 예시:

```graphQL
query GetSurveyOutputDto{
  getSurvey(getSurveyInput: {surveyId: 1}) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

## GetAllSurveys

모든 survey 가져오기

query 예시:

```GraphQL
query GetSurveysOutputDto{
  getSurveys {
    ok
    message
    surveyDtos{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```
  
  <br/>

## UpdateSurvey

`surveyId`에 해당하는 survey의 title과 description 수정하기

> `changedTitle`, `changedDescription`은 optional하게 입력 가능

query 예시:

```graphQL
mutation UpdateSurveyOutputDto{
  updateSurvey(updateSurveyInput: {surveyId: 1,
  changedTitle:"당신의 취향은?", changedDescription:"좋아하는 것을 골라주세요"}) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

## DeleteSurvey

`surveyId`에 해당하는 survey 삭제하기

query 예시:

```graphQL
mutation DeleteSurveyOutputDto{
  deleteSurvey(deleteSurveyInput: {surveyId: 1}) {
    ok
    message
  }
}
```

  <br/>

# Question

`Question`에 관한 API입니다.

  <br/>

## CreateQuestion

`surveyId`에 해당하는 survey안의 question중, 원하는 순서의 question 안에 선택지 추가하기

> option 생성 시 기존에 있던 option 사이에 끼워넣기 가능

query 예시:

```graphQL
mutation CreateOptionOutputDto {
  createOption(createOptionInput: {surveyId: 1, questionOrder: 1,
  optionOrder: 1 ,optionText: "치킨", score: 4}) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

## GetQuestion

`surveyId`에 해당하는 survey안의 question중, 원하는 순서의 question 가져오기

query 예시:

```graphQL
query GetQuestionOutputDto{
  getQuestion (getQuestionInput: {surveyId: 5,
  questionOrder: 2}) {
    ok
    message
    questionDto{
      questionText
      questionOrder
      options{
        optionText
        optionOrder
        score
      }
    }
  }
}
```

  <br/>

## UpdateQuestion

`surveyId`에 해당하는 survey안의 question중, 원하는 순서의 question의 `questionText` 수정하기

query 예시:

```graphQL
mutation UpdateQuestionOutputDto {
  updateQuestion(updateQuestionInput: {surveyId: 1,
  questionOrder: 1, chaingedText: "좋아하는 음식은?"}) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

## DeleteQuestion

`surveyId`에 해당하는 survey안의 question중, 원하는 순서의 question 삭제하기

query 예시:

```graphQL
mutation DeleteQuestionOutputDto {
  deleteQuestion(deleteQuestionInput: {surveyId: 1,
  questionOrder: 1}) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

# Option

`Option`에 관한 API입니다.

  <br/>

## CreateOption

`surveyId`에 해당하는 survey안의 question중, 원하는 순서의 question 안에 선택지 추가하기

> option 생성 시 기존에 있던 option 사이에 끼워넣기 가능

query 예시:

```graphQL
mutation CreateOptionOutputDto {
  createOption(createOptionInput: {surveyId: 1, questionOrder: 1,
  optionOrder: 1 ,optionText: "치킨", score: 4}) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
      questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

## GetOption

`surveyId`에 해당하는 survey안의 question중, 원하는 순서의 question 안의 option중 원하는 순서의 option 가져오기

query 예시:

```graphQL
query GetOptionOutputDto {
  getOption(getOptionInput: {surveyId:1, questionOrder: 1,
  optionOrder:1}) {
    ok
    message
    optionDto {
      optionText
      optionOrder
      score
      createdAt
    }
  }
}
```

  <br/>

## UpdateOption

`surveyId`에 해당하는 survey안의 question중, 원하는 순서의 question 안의 option중 원하는 순서의 option 가져오기

> `changedScore`와 `changedText`는 optional하게 입력 가능

query 예시:

```graphQL
mutation UpdateOptionOutputDto {
  updateOption(updateOptionInput: {surveyId: 1, questionOrder: 1,
  optionOrder: 1,changedScore: 2, changedText: "피자"}) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

## DeleteOption

`surveyId`에 해당하는 survey안의 question중, 원하는 순서의 question 안의 option중 원하는 순서의 option 삭제하기

query 예시:

```graphQL
mutation DeleteOptionOutputDto {
  deleteOption(deleteOptionInput: {surveyId: 1, questionOrder: 1,
  optionOrder: 1}) {
    ok
    message
    surveyDto{
      id
      title
      description
      createdAt
      questions {
        questionText
        questionOrder
        options {
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

# Answer

`Answer`에 관한 API입니다.

  <br/>

## CreateAnswer

`surveyId`에 해당하는 survey에 문항을 적어서`[questionOrder,optionOrder]` 답변 생성하기

> 예를 들어, `[[1,2],[3,2]]` => 1번 question의 2번 option 체크, 3번 question 의 2번 option 체크
>
> > 만약 하나의 question에서 중복해서 작성할 경우, 뒤에 있는 option을 선택. 예를 들어, `[[1,2],[1,1]]`입력할 경우, 1번 option을 선택한 것으로 간주

> `Survey`의 모든 question에 대한 답변을 하기 전까지 totalScore는 `null` return

```graphQL
mutation CreateAnswerOutputDto {
  createAnswer(createAnswerInput: {surveyId: 1,
  questionAndOptionOrders: [[1,1],[2,2]]}) {
    ok
    message
    answerDto {
      id
      surveyDto{
        title
        description
      }
      selectedOptionDtos{
        questionText
        optionText
        questionOrder
        optionOrder
        score
      }
      remainedQuestionDtos{
        questionText
        questionOrder
        options{
          optionText
          optionOrder
          score
        }
      }
      totalScore
    }
  }
}
```

  <br/>

## GetAnswer

`answerId`에 해당하는 answer 불러오기

query 예시:

```graphQL
query GetAnswerOutputDto {
  getAnswer(getAnswerInput: {answerId: 1}) {
    ok
    message
    answerDto {
      selectedOptionDtos{
        optionText
        optionOrder
        questionOrder
        score
      }
      remainedQuestionDtos{
        questionText
        questionOrder
        options{
          optionText
          optionOrder
          score
        }
      }
      surveyDto{
        title
        description
      }
      totalScore
    }
  }
}
```

  <br/>

## GetAllAnswersOfSurvey

`surveyID`에 해당하는 survey안에 생성했던 모든 answer 불러오기

```graphQL
query GetAnswersOutputDto {
  getAnswers (getAnswersInput: {surveyId: 1}) {
    ok
    essage
    answerDtos{
      id
      totalScore
      selectedOptionDtos{
        optionText
        optionOrder
        questionOrder
        score
      }
      remainedQuestionDtos{
        questionText
        questionOrder
        options{
          optionText
          optionOrder
          score
        }
      }
    }
  }
}
```

  <br/>

## UpdateAnswer

`answerId`에 해당하는 answer의 답변 수정

> CreateAnswer 설명에 자세한 로직 기재

query예시:

```graphQL
mutation UpdateAnswerOutputDto {
  updateAnswer(updateAnswerInput: {answerId: 1,
  questionAndOptionOrders: [[1,1],[2,1],[3,1]]}) {
    ok
    message
    answerDto {
      id
        surveyDto{
        title
        description
      }
      selectedOptionDtos{
        questionText
        optionText
        questionOrder
        optionOrder
        score
      }
      remainedQuestionDtos{
        questionText
        questionOrder
        options{
          optionText
          optionOrder
          score
        }
      }
  
      totalScore
    }
  }
}
```

  <br/>
  
## DeleteAnswer

`answerId`에 해당하는 answer 삭제

```graphQL
mutation DeleteAnswerOutputDto {
  deleteAnswer(deleteAnswerInput: {answerId: 1})
  {
    ok
    message
  }
}
```

  <br/>

---

## ER Diagram

![download](https://kroki.io/graphviz/svg/eNqNkM1uwjAQhO95ilWOFCJxJQoSJy6VUEtvUQ4Gr4iFsd21A63avjsJOEB-iHrc8cy33uFiR8zksISfAIipPReUvL7HASjNEVKbM4MJ4VYTz0p1XdARvyGVbIMyCf34Cy_ghJM4A-tIqN1F4Wi3JIwTWtV6mMUQwFuBtlJvmJtQxT798IFfrsGrH1bEkWagisMG6UpcmQbPj1VIm16WLQ_CmvFg7GEvlD2Vnprtx8vJ2jG5fiRdE76Vybx76TSKRuEYGJE-5ch4EipNByZbxZTRVtPTZuqI2I20Whje5c29n3yy6x5pdTKwxju7vxs9WXIP_K-BvzNYjen7)

## File Tree

```
📦HeartLab_test
 ┣ 📂src
 ┃ ┣ 📂answer
 ┃ ┃ ┣ 📜answer.module.ts
 ┃ ┃ ┣ 📜answer.resolver.ts
 ┃ ┃ ┗ 📜answer.service.ts
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┣ 📜answer.dto.ts
 ┃ ┃ ┃ ┣ 📜create-answer.dto.ts
 ┃ ┃ ┃ ┣ 📜delete-answer.dto.ts
 ┃ ┃ ┃ ┣ 📜get-answer.dto.ts
 ┃ ┃ ┃ ┗ 📜update-answer.dto.ts
 ┃ ┃ ┗ 📂entities
 ┃ ┃ ┃ ┗ 📜answer.entity.ts
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┗ 📜core.dto.ts
 ┃ ┃ ┣ 📂entity
 ┃ ┃ ┃ ┗ 📜core.entity.ts
 ┃ ┃ ┣ 📂error
 ┃ ┃ ┃ ┗ 📜error.class.ts
 ┃ ┃ ┗ 📂utils
 ┃ ┃ ┃ ┗ 📜response.util.ts
 ┃ ┣ 📂config
 ┃ ┃ ┣ 📜typeorm.config.ts
 ┃ ┃ ┗ 📂config
 ┃ ┃ ┃ ┗ 📂logger.ts
 ┃ ┃ ┃ ┃ ┗ 📜logger.config.ts
 ┃ ┣ 📂option
 ┃ ┃ ┣ 📜option.module.ts
 ┃ ┃ ┣ 📜option.resolver.ts
 ┃ ┃ ┗ 📜option.service.ts
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┣ 📜option.dto.ts
 ┃ ┃ ┃ ┣ 📜create-option.dto.ts
 ┃ ┃ ┃ ┣ 📜delete-option.dto.ts
 ┃ ┃ ┃ ┣ 📜get-option.dto.ts
 ┃ ┃ ┃ ┗ 📜update-option.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜option.entity.ts
 ┃ ┃ ┗ 📂types
 ┃ ┃ ┃ ┗ 📜option.type.ts
 ┃ ┣ 📂question
 ┃ ┃ ┣ 📜question.module.ts
 ┃ ┃ ┣ 📜question.resolver.ts
 ┃ ┃ ┗ 📜question.service.ts
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┣ 📜question.dto.ts
 ┃ ┃ ┃ ┣ 📜create-question.dto.ts
 ┃ ┃ ┃ ┣ 📜delete-question.dto.ts
 ┃ ┃ ┃ ┣ 📜get-question.dto.ts
 ┃ ┃ ┃ ┗ 📜update-question.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜question.entity.ts
 ┃ ┃ ┗ 📂types
 ┃ ┃ ┃ ┗ 📜question.type.ts
 ┃ ┗ 📂survey
 ┃ ┃ ┣  📜survey.module.ts
 ┃ ┃ ┣  📜survey.resolver.ts
 ┃ ┃ ┗  📜survey.service.ts
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┣  📜survey.dto.ts
 ┃ ┃ ┃ ┣ 📜create-survey.dto.ts
 ┃ ┃ ┃ ┣ 📜delete-survey.dto.ts
 ┃ ┃ ┃ ┣ 📜get-survey.dto.ts
 ┃ ┃ ┃ ┗ 📜update-survey.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗  📜survey.entity.ts
 ┃ ┃ ┗ 📂types
 ┃ ┃ ┃ ┗  📜survey.type.ts
 ┣ 📜.eslintrc.js
 ┣ 📜.gitignore
 ┣ 📜.README.md
 ┣ 📜.nest-cli.json
 ┣ 📜.package.json
 ┣ 📜.tsconfig.build.json
 ┗ 📜.tsconfig.json
```
