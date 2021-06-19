const dayjs = require('dayjs');
const { Cherish, sequelize, User, user_log, cherish_log } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { validationResult } = require('express-validator');
const logger = require('../config/winston');
const pushService = require('../service/pushService');

module.exports = {
  /**
   * 물주는 날짜 미루기
   * req.params : id (Cherish id)
   * body: postpone (미루는 날짜, 1-7사이의 정수로 받음)
   */

  postponeWaterDate: async (req, res) => {
    logger.info(`PUT /postpone - postponeWaterDate`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`PUT /postpone - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { id, postpone, is_limit_postpone_number } = req.body;
    const t = await sequelize.transaction();

    try {
      const cherish = await Cherish.findOne({
        where: {
          id: id,
          active: 'Y',
        },
      });
      const date = cherish.water_date;
      const newDate = dayjs(date).add(postpone, 'day').format('YYYY-MM-DD hh:mm:ss');

      await Cherish.update(
        {
          water_date: newDate,
        },
        {
          where: {
            id: id,
            active: 'Y',
          },
        },
        { transaction: t }
      );
      await Cherish.increment(
        { postpone_number: 1 },
        { where: { id: id, active: 'Y' } },
        { transaction: t }
      );

      const user = await Cherish.findOne({
        where: {
          id: id,
          active: 'Y',
        },
        attributes: ['UserId'],
      });

      await User.increment(
        { postpone_count: 1 },
        { where: { id: user.dataValues.UserId } },
        { transaction: t }
      );
      const userInfo = await User.findOne({
        where: {
          id: user.dataValues.UserId,
          active: 'Y',
        },
      });
      await user_log.create(
        {
          user_id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          password: userInfo.password,
          salt: userInfo.salt,
          nickname: userInfo.nickname,
          phone: userInfo.phone,
          sex: userInfo.sex,
          birth: userInfo.birth,
          profile_image_url: userInfo.profile_image_url,
          postpone_count: userInfo.postpone_count,
          fcm_token: userInfo.fcm_token,
          active: userInfo.active,
          status: 'UPDATE',
          service_name: 'postponeWaterDate',
        },
        { transaction: t }
      );

      // 성장률이 0이 아니고 is_limit_postpone_number가 true일 때 성장률 -1 감소
      if (cherish.growth != 0 && is_limit_postpone_number) {
        await Cherish.increment(
          { growth: -1 },
          { where: { id: id, active: 'Y' } },
          { transaction: t }
        );
      }
      // cherish_log 테이블
      await cherish_log.create(
        {
          cherish_id: id,
          name: cherish.name,
          nickname: cherish.nickname,
          phone: cherish.phone,
          sex: cherish.sex,
          birth: cherish.birth,
          growth: cherish.growth,
          notice_time: cherish.notice_time,
          start_date: cherish.start_date,
          water_date: cherish.water_date,
          postpone_number: cherish.postpone_number,
          cycle_date: cherish.cycle_date,
          active: cherish.active,
          status: 'UPDATE',
          service_name: 'postponeWaterDate',
        },
        { transaction: t }
      );
      await pushService.updatePushCom({ CherishId: id, push_date: cherish.water_date });

      t.commit();
      return res.status(sc.OK).send(ut.success(rm.POSTPONE_SUCCESS));
    } catch (err) {
      console.log(err);
      await t.rollback();
      logger.error(`PUT /postpone - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },

  getPostpone: async (req, res) => {
    logger.info(`GET /postpone - getPostpone`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /postpone - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId } = req.query;
    try {
      const cherish = await Cherish.findOne({
        attributes: ['water_date', 'postpone_number'],
        where: {
          id: CherishId,
          active: 'Y',
        },
      });
      const is_limit_postpone_number = cherish && cherish.postpone_number >= 3 ? true : false;
      cherish.dataValues.water_date = dayjs(cherish.water_date).format('YY-MM-DD');

      return res
        .status(sc.OK)
        .send(ut.success(rm.GET_WATER_POSTPONE, { cherish, is_limit_postpone_number }));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
  getPostponeCount: async (req, res) => {
    logger.info(`GET /postpone - getPostponeCount`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /postpone - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId } = req.query;
    try {
      const cherish = await Cherish.findOne({
        attributes: ['water_date', 'postpone_number'],
        where: {
          id: CherishId,
        },
      });
      const is_limit_postpone_number = cherish && cherish.postpone_number >= 3 ? true : false;

      // 이미 미루기 횟수가 초과된 경우
      if (is_limit_postpone_number) {
        return res.status(sc.OK).send(ut.fail(rm.IMPOSSIBLE_WATER_POSTPONE));
      }
      return res.status(sc.OK).send(
        ut.success(rm.POSSIBLE_WATER_POSTPONE, {
          cherish,
        })
      );
    } catch (err) {
      console.log(err);
      logger.error(`GET /postpone - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
};
