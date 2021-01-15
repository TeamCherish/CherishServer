const { validationResult } = require('express-validator');
const dayjs = require('dayjs');

const { Cherish, Water } = require('../models');

const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');

const waterService = require('../service/waterService');
const logger = require('../config/winston');

module.exports = {
  /**
   * body: water_date, review, keyword1, keyword2, keyword3, UserId
   */
  postWater: async (req, res) => {
    logger.info(`POST /water - postWater`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /water - Paramaters Error - postWater`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { review, keyword1, keyword2, keyword3, CherishId } = req.body;

    try {
      // CherishId 가 없으면? 나빠요..
      if (!CherishId) {
        console.log('필요한 값이 없습니다.');
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.NULL_VALUE));
      }

      let score = 0;
      if (keyword1) {
        score += 1;
      }

      if (review) {
        score += 1;
      }
      // models_water에 작성한 내용 생성하기

      const water = await waterService.postWater(CherishId, review, keyword1, keyword2, keyword3);

      // water_date 구하기
      const w = await Water.findOne({
        attributes: ['water_date'],
        where: {
          CherishId: CherishId,
        },
      });

      /*
      // water_date 구하기
      var moment = require('moment');
      require('moment-timezone');
      moment.tz.setDefault("Asia/Seoul");
      Water.water_date = moment().format('YYYY-MM-DD HH:mm:ss');
      */

      // Cherish에서 growth 받아오기
      const cherishGrowth = await Cherish.findOne({
        attributes: ['growth', 'cycle_date'],
        where: {
          id: CherishId,
        },
      });
      let growth = cherishGrowth.dataValues.growth;
      if (score != 0) {
        growth += score;
      }
      const date = dayjs()
        .add(parseInt(cherishGrowth.dataValues.cycle_date), 'day')
        .format('YYYY-MM-DD');
      await Cherish.update(
        {
          postpone_number: 0,
          growth: growth,
          water_date: date,
        },
        {
          where: {
            id: CherishId,
          },
        }
      );

      return res.status(sc.OK).send(ut.success(rm.OK, score));
    } catch (err) {
      console.log(err);
      logger.error(`POST /water - Server Error - postWater`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },

  // CherishId 별 리뷰내용 보기
  getWater: async (req, res) => {
    logger.info(`GET /water/:id - getWater`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /water/:id - Paramaters Error - getWater`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId } = req.query;

    try {
      // Water 리뷰 가져오기
      const water = await Water.findAll({
        attributes: ['id', 'review', 'water_date', 'keyword1', 'keyword2', 'keyword3'],
        where: {
          CherishId: CherishId,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
};
