# Survey API Server

---

본 프로젝트는 설문지 API 서버입니다.

## Project Environment

---

- NodeJS: v18.15.0
- TypeScript: v5.1.3
- GraphQL: v16.8.1
- TypeORM: v0.3.17
- NestJS: v10.0.0
- Winston v3.11.0

### Getting Started

---

```bash
$ git clone https://github.com/seohokim/HeartLab_test.git
```

## npm install

npm package 설치

```bash
$ npm install
```

## DB 설정

아래 파일을 참고하여 DB 설정을 해주세요.
[typeorm.config.ts][./src/config/typeorm.config.ts]

```
📦HeartLab_test
 ┣ 📂[src]
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
```
