const { validationResult } = require('express-validator');

const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const userService = require('../service/userService');
const logger = require('../config/winston');
const jwt = require('jsonwebtoken')
const secretKey = require('../config');

module.exports = {
  /* 회원조회 */
  signin: async (req, res) => {
    logger.info('POST /login/signin');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /login/signin - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    // 1. req.body에서 데이터 가져오기
    const { email, password } = req.body;

    try {
      //2. 존재하는 아이디인지 확인하기. 존재하지 않는 아이디면 NO USER 반환
      const alreadyEmail = await userService.emailCheck({
        email,
      });
      if (!alreadyEmail) {
        logger.error(`POST /login/signin - emailCheck Error`);
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.NO_USER));
      }
      //3. password(=alreadyPassword)와 일치하면 true, 일치하지 않으면 Miss Match password 반환
      if (password !== alreadyEmail.password) {
        logger.error(`POST /login/signin - password Error`);
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.MISS_MATCH_PW, password));
      }

      const user = await userService.signin({
        email,
        password,
      });

      const UserId = user.id;
      const user_nickname = user.nickname;

      // 토큰 발행
      const token = await jwt.sign({
        UserId,
      }, secretKey.JWT_SECRET, {
        expiresIn: '15m', // 15분
          issuer: 'TL',
      });

      //4. status: 200 ,message: SIGN_IN_SUCCESS, data: email반환
      return res.status(sc.OK).send(
        ut.success(rm.SIGN_IN_SUCCESS, {
          UserId,
          user_nickname,
          token
        })
      );
    } catch (error) {
      logger.error(`POST /login/signin - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.SIGN_IN_FAIL));
    }
  },

  /* 회원가입 */
  signup: async (req, res) => {
    const { email, password, sex, nickname, phone, birth } = req.body;

    // 전 API에서 입력한 email 가져오기

    if (!email || !password || !sex || !nickname || !phone || !birth) {
      console.log('필요한 값이 없습니다!');
      return res.status(sc.BAD_REQUEST).send(ut.fail(rm.NULL_VALUE));
    }
    try {
      //중복확인 부분
      const alreadyEmail = await userService.emailCheck({
        email,
      });
      if (alreadyEmail) {
        console.log('이미 존재하는 이메일 입니다.');
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.ALREADY_EMAIL));
      }
      //여까지(일단 살려둘래)
      const user = await userService.signup(email, password, sex, nickname, phone, birth);

      return res.status(sc.OK).send(
        ut.success(rm.SIGN_UP_SUCCESS, {
          nickname: user.nickname,
        })
      );
    } catch (error) {
      console.error(error);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.SIGN_UP_FAIL));
    }
  },
  phoneAuth: async (req, res) => {
    logger.info(`POST /phoneAuth - phoneAuth`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /phoneAuth - Paramaters Error - phoneAuth`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { phone } = req.body;
    try {
      const verifyCode = await userService.sendNumber({ phone });
      if (verifyCode === 0) {
        logger.error(`POST /phoneAuth - Server Error - phoneAuth`);
        return res.status(sc.OK).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
      }
      return res.status(sc.OK).send(ut.success(rm.SEND_SUCCESS, verifyCode));
    } catch (err) {
      console.log(err);
      logger.error(`POST /phoneAuth - Server Error - phoneAuth`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
};

/**
 * salt는 일단 뺏읍니다.
 * 1. req.body에서 데이터 가져오기
 * >> models/user의 email, password
 * 2. request data 확인하기, email, password data가 없다면 NullValue 반환
 * 3. 존재하는 아이디인지 확인하기. 존재하지 않는 아이디면 NO USER 반환
 * 4. 비밀번호 확인하기 - 로그인할 email의 salt를 DB에서 가져와서 사용자가 request로 보낸 password와 암호화
 * 5. 디비에 저장되어있는 password와 일치하면 true, 일치하지 않으면 Miss Match password 반환
 * 6. status: 200 ,message: SIGN_IN_SUCCESS, data: id, email 반환
 */
