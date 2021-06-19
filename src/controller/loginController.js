const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const userService = require('../service/userService');
const logger = require('../config/winston');
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

      const user = await userService.signin({
        email,
        password,
      });
      console.log(user)
      if (!user) {
        // 널이면 비밀번호가 틀림
        logger.error(`POST /login/signin - password Error`);
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.MISS_MATCH_PW, password));
      }
      const UserId = user.id;
      const user_nickname = user.nickname;

      // 토큰 발행
      const token = await jwt.sign(
        {
          UserId,
        },
        secretKey.JWT_SECRET,
        {
          expiresIn: '15m', // 15분
          issuer: 'TL',
        }
      );

      //4. status: 200 ,message: SIGN_IN_SUCCESS, data: email반환
      return res.status(sc.OK).send(
        ut.success(rm.SIGN_IN_SUCCESS, {
          UserId,
          user_nickname,
          token,
        })
      );
    } catch (error) {
      logger.error(`POST /login/signin - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.SIGN_IN_FAIL));
    }
  },

  /* 회원가입 */
  signup: async (req, res) => {
    const { email, password, nickname, phone} = req.body;

    // 전 API에서 입력한 email 가져오기

    if (!email || !password || !nickname || !phone ) {
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
      const user = await userService.signup(email, password, nickname, phone);

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

  /* 비밀번호 찾기 */
  findPassword: async (req, res) => {
    logger.info('POST /login/findPassword');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /login/findPassword - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    // 1. req.body에서 데이터 가져오기
    const { email } = req.body;

    try {
      //2. 존재하는 아이디인지 확인하기. 존재하지 않는 아이디면 NO USER 반환
      const alreadyEmail = await userService.emailCheck({
        email,
      });
      if (!alreadyEmail || !alreadyEmail.phone) {
        logger.error(`POST /login/findPassword - emailCheck Error`);
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.NO_USER));
      }
      const phone = alreadyEmail.phone.replace(/\-/g, '');
      const verifyCode = await userService.sendNumber({ phone });
      if (verifyCode === 0) {
        logger.error(`POST /login/findPassword - sendNumber Error`);
        return res.status(sc.OK).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
      }

      return res.status(sc.OK).send(
        ut.success(rm.FIND_PASSWORD_SUCCESS, {
          verifyCode,
        })
      );
    } catch (error) {
      logger.error(`POST /login/findPassword - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.FIND_PASSWORD_FAIL));
    }
  },

  /* 비밀번호 변경 */
  updatePassword: async (req, res) => {
    logger.info('POST /login/updatePassword');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /login/updatePassword - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    // 1. req.body에서 데이터 가져오기
    const { email, password1, password2 } = req.body;

    //2. password1과 password2가 맞는지 확인
    if (password1 !== password2) {
      logger.error(`POST /login/updatePassword - Paramaters Error`);
      return res.status(400).send(ut.fail(rm.NO_MATCH_PASSWORD));
    }
    try {
      const alreadyEmail = await userService.emailCheck({
        email,
      });
      if (!alreadyEmail) {
        logger.error(`POST /login/updatePassword - emailCheck Error`);
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.NO_USER));
      }
      await userService.updatePassword({
        email,
        password1,
      });
      return res.status(sc.OK).send(ut.success(rm.UPDATE_PASSWORD_SUCCESS));
    } catch (error) {
      logger.error(`POST /login/updatePassword - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.UPDATE_PASSWORD_FAIL));
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
