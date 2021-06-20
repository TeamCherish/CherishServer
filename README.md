# 🌿 Cherish-Server
![server](https://user-images.githubusercontent.com/72644361/104651996-c792d180-56fb-11eb-867c-5b55dbe21833.png)

<br>
</div>

---

# 1. API DOC LINK (Notion)

- [API 문서](https://www.notion.so/API-6c4294a239d1446c844022af30b3b252)

---

# 2. Dependency Module

```
"dependencies": {
    "dayjs": "^1.10.1",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "express-validator": "^6.9.0",
    "log4js": "^6.3.0",
    "mysql2": "^2.2.5",
    "sequelize": "^6.3.5"
  }
```

- [Async & Await](https://www.npmjs.com/package/async)

- [JWT(JsonWebTokens)](https://www.npmjs.com/package/jsonwebtoken)

- [request(HTTP)](https://www.npmjs.com/package/request)

- [multer](https://www.npmjs.com/package/multer)

- [crypto](https://www.npmjs.com/package/create-hash)

- [moment](https://www.npmjs.com/package/moment)

---

# 3. ERD Diagram

![ERD_final](https://user-images.githubusercontent.com/60417796/104613332-79b1a580-56ca-11eb-8af7-3ea578abacc1.png)


---

# 4. Main Function 

- Cherish 등록 / 수정 / 삭제
- Cherish 물주기 / 미루기
- Cherish 후기 등록 / 수정 / 삭제
- 회원가입 / 로그인
- 식물카드(체리쉬) 상세보기
- 마이페이지
- 메인뷰
- 최신 연락 키워드 조회
- PUSH 알림

---

# 5. Team Role

#### 🤴 남궁권 ([kkoon9](https://github.com/kkoon9))

- 프로젝트 구축
- 메인 뷰 API
- 식물 카드 상세보기 API
- 미루기 횟수 체크 API
- 마이페이지 API
- PUSH 알림

####  👸 이영은 ([YeongEunLee](https://github.com/YeongEunLee))

- 데이터 모델링
- Cherish 등록하기 API
- Cherish 정보 수정하기 API
- Cherish 삭제하기 API
- 물주는 날짜 미루기 API
- Keyword, Review 조회 하기 API
- 식물 상세 정보 조회 하기 API
- PUSH 알림 API

####  👶 한수아 ([sssua-0928](https://github.com/sssua-0928))

- 후기 등록(물주기) API
- 로그인 API
- 물주는 날짜 조회하기 API
- 최신 연락 Keyword 조회하기 API
- 회원 가입 API
- 푸시 알림 API


####  칸반보드 노션링크 [(참고)](https://www.notion.so/Server-6854a0c36b1146f19cfe32dafde87ef5)

---

# 6. Develop Framework & Environment

- [Node.js](https://nodejs.org/ko/) - Chrome V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임
- [Express.js](http://expressjs.com/ko/) - Node.js 웹 애플리케이션 프레임워크
- [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
- [vscode](https://code.visualstudio.com/) - 편집기
- [MySQL](https://www.mysql.com/) - DataBase
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - MySQL 시각화 툴
- [AWS EC2](https://aws.amazon.com/ko/ec2/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_ec2_b&sc_content=ec2_e&sc_detail=aws%20ec2&sc_category=ec2&sc_segment=177228231544&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177228231544!e!!g!!aws%20ec2&ef_id=WkRozwAAAnO-lPWy:20180412120123:s) - 클라우드 환경 컴퓨팅 시스템
- [AWS RDS](https://aws.amazon.com/ko/rds/) - 클라우드 환경 데이터베이스 관리 시스템
- [AWS S3](https://aws.amazon.com/ko/s3/) - 클라우드 스토리지

---

# 7. 서버 아키텍쳐
![서버 아키텍처(2)](https://user-images.githubusercontent.com/72644361/104618304-dd8a9d00-56cf-11eb-9c7e-6606b7ffe75c.png)

