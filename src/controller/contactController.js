const { validationResult } = require('express-validator');
const dayjs = require('dayjs');

const { Cherish, Water } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const logger = require('../config/winston');

module.exports = {
  /**
   * 최신 연락 키워드 조회하기
   * req.params : CherishId (Cherish id)
   * body: keyword1, keyword2, keyword3
   */
  getNewKeyword: async (req, res) => {
    logger.info('GET /contact/:id - getNewKeyword');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /contact/:id - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }

    // req.params 에서 CherishId 가져오기
    const CherishId = req.params.id;
    //
    try {
      const cherish = await Cherish.findOne({
        attributes: ['nickname'],
        where: {
          id: CherishId,
          active: 'Y',
        },
      });

      const nickname = cherish.dataValues.nickname;

      const result = {};
      const water = await Water.findOne({
        attributes: ['id', 'water_date', 'keyword1', 'keyword2', 'keyword3'],
        where: {
          CherishId: CherishId,
          active: 'Y',
        },
        order: [['water_date', 'DESC']],
      });

      if (water) {
        result.keyword1 = water.dataValues.keyword1;
        result.keyword2 = water.dataValues.keyword2;
        result.keyword3 = water.dataValues.keyword3;
        result.water_date = dayjs(water.water_date).format('YY-MM-DD');
      } else {
        result.keyword1 = '';
        result.keyword2 = '';
        result.keyword3 = '';
        result.water_date = '';
      }

      return res.status(sc.OK).send(
        ut.success(rm.CONTACT_KEYWORD_SUCCESS, {
          nickname,
          result,
        })
      );
    } catch (err) {
      console.log(err);
      logger.error(`DELETE /contact - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail);
    }
  },
};
