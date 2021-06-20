const dayjs = require('dayjs');
const { Cherish } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { validationResult } = require('express-validator');
const logger = require('../config/winston');

module.exports = {
  /**
   * 물주는 날짜 조회하기
   * req.params : id (Cherish id)
   * body: water_date
   */

  searchWaterDate: async (req, res) => {
    logger.info(`GET /search/:id - searchWaterDate`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /search/:id - Paramaters Error - searchWaterDate`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const CherishId = req.params.id;
    // 2.
    try {
      const cherish = await Cherish.findOne({
        attributes: ['water_date'],
        where: {
          id: CherishId,
        },
      });
      const WaterDate = dayjs(cherish.water_date).format('YYYY-MM-DD');
      return res.status(sc.OK).send(
        ut.success(rm.SEARCH_SUCCESS, {
          WaterDate,
        })
      );
    } catch (error) {
      logger.error(`GET /search/:id - Server Error - searchWaterDate`);
      console.log(error);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.SEARCH_FAIL));
    }
  },
};
