const dayjs = require('dayjs');
const { App_push_user, Cherish, sequelize } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { validationResult } = require('express-validator');
const { pushService } = require('../service');
const logger = require('../config/winston');

module.exports = {
  getPushUser: async (req, res) => {
    logger.info(`GET /push - getPushUser`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /push - Paramaters Error - getPushUser`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }

    const { send_code, notice_time } = req.params;
    const query = `SELECT APU.mobile_device_token,
                          C.nickname,
                          DATE_FORMAT(APU.push_date,'%Y-%m-%d') AS push_date,
                          APU.CherishId,
                          APU.UserId
                   FROM cherish C
                      INNER JOIN app_push_user APU ON C.id=APU.CherishId
                      INNER JOIN user U ON U.id=APU.UserId
                   WHERE APU.send_yn='N'
                     AND APU.send_code='${send_code}'
                     AND C.notice_time='${notice_time}'
                     AND APU.active='Y'
                     AND C.active='Y'
                     AND C.water_notice='1'
                     AND U.active='Y' # 회원탈퇴한 유저는 푸시 안가게
                     AND (U.fcm_token != '' AND U.fcm_token is not null) # 로그아웃한 유저는 푸시 안가게
                     `;
    try {
      const [results] = await sequelize.query(query);
      let date = new Date();
      const today = dayjs(date.toLocaleString('en', { timeZone: 'Asia/Seoul' })).format(
        'YYYY-MM-DD'
      );
      const push_list = results.filter((result) => {
        return result.push_date === today;
      });
      return res.status(sc.OK).send(ut.success(rm.GET_PUSH_USER_SUCCESS, push_list));
    } catch (err) {
      console.log(err);
      logger.error(`GET /push - Server Error - getPushUser`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.GET_PUSH_USER_FAIL));
    }
  },

  contactCherish: async (req, res) => {
    logger.info(`POST /push - contactCherish`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /push - Parameters Error - contactCherish`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId } = req.body;
    const now_date = dayjs();
    const cherish = await Cherish.findOne({
      attributes: ['UserId', 'cycle_date'],
      where: { id: CherishId, active: 'Y' },
    });
    const water_date = dayjs(now_date)
      .add(cherish.dataValues.cycle_date, 'day')
      .format('YYYY-MM-DD');

    try {
      await pushService.createPushCOM({
        UserId: cherish.dataValues.UserId,
        CherishId: CherishId,
        water_date,
      });
      return res.status(sc.OK).send(ut.success(rm.UPDATE_PUSH_USER_SUCCESS));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.UPDATE_PUSH_USER_FAIL));
    }
  },

  reviewPush: async (req, res) => {
    logger.info(`POST /pushReview - reviewPush`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /pushReview - Paramaters Error - reviewPush`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId } = req.body;
    const push_date = dayjs().format('YYYY-MM-DD');
    const cherish = await Cherish.findOne({
      attributes: ['UserId'],
      where: { id: CherishId, active: 'Y' },
    });

    try {
      await pushService.createPushREV({
        UserId: cherish.dataValues.UserId,
        CherishId: CherishId,
        push_date: push_date,
      });
      return res.status(sc.OK).send(ut.success(rm.UPDATE_PUSH_USER_SUCCESS));
    } catch (err) {
      console.log(err);
      logger.error(`POST /pushReview - Server Error - reviewPush`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.UPDATE_PUSH_USER_FAIL));
    }
  },

  updateSendYN_COM: async (req, res) => {
    logger.info(`PUT /push - updateSendYN_COM`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`PUT /push - Paramaters Error - updateSendYN_COM`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId } = req.body;

    try {
      await App_push_user.update(
        {
          send_yn: 'Y',
          updatedAt: sequelize.fn('NOW'),
        },
        {
          where: {
            CherishId: CherishId,
            send_yn: 'N',
            send_code: 'COM',
            active: 'Y',
          },
        }
      );

      return res.status(sc.OK).send(ut.success(rm.UPDATE_Y_N_SUCCESS));
    } catch (err) {
      console.log(err);
      logger.error(`PUT /push - Server Error - updateSendYN_COM`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.UPDATE_Y_N_FAIL));
    }
  },

  updateSendYN_REV: async (req, res) => {
    logger.info(`PUT /pushReview - updateSendYN_REV`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`PUT /pushReview - Paramaters Error - updateSendYN_REV`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId } = req.body;

    try {
      await App_push_user.update(
        {
          send_yn: 'Y',
          updatedAt: sequelize.fn('NOW'),
        },
        {
          where: {
            CherishId: CherishId,
            send_yn: 'N',
            send_code: 'REV',
            active: 'Y',
          },
        }
      );

      return res.status(sc.OK).send(ut.success(rm.UPDATE_Y_N_SUCCESS));
    } catch (err) {
      console.log(err);
      logger.error(`PUT /pushReview - Server Error - updateSendYN_REV`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.UPDATE_Y_N_FAIL));
    }
  },
  updateToken: async (req, res) => {
    logger.info(`PUT /push/token - updateToken`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`PUT /push/token - Paramaters Error - updateToken`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { UserId } = req.body;
    try {
      await pushService.updatePushFcmToken({
        UserId,
      });
      return res.status(sc.OK).send(ut.success(rm.UPDATE_PUSH_TOKEN_SUCCESS));
    } catch (err) {
      console.log(err);
      logger.error(`PUT /push/token - Server Error - updateToken`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.UPDATE_PUSH_TOKEN_FAIL));
    }
  },
  insertAppPushUserByCherishIdAndUserId: async (req, res) => {
    logger.info(`POST /push/insert - insertAppPushUserByCherishIdAndUserId`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /push/insert - Parameters Error - insertAppPushUserByCherishIdAndUserId`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId } = req.body;
    const now_date = dayjs();
    const cherish = await Cherish.findOne({
      attributes: ['UserId', 'cycle_date'],
      where: { id: CherishId, active: 'Y' },
    });
    const water_date = dayjs(now_date)
      .add(cherish.dataValues.cycle_date, 'day')
      .format('YYYY-MM-DD');

    try {
      await pushService.createPushCOM({
        UserId: cherish.dataValues.UserId,
        CherishId: CherishId,
        water_date,
      });
      await pushService.createPushREV({
        UserId: cherish.dataValues.UserId,
        CherishId: CherishId,
        push_date: water_date,
      });
      return res.status(sc.OK).send(ut.success(rm.UPDATE_PUSH_USER_SUCCESS));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.UPDATE_PUSH_USER_FAIL));
    }
  },
};
