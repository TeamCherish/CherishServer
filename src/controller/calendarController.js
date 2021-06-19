const { validationResult } = require('express-validator');
const dayjs = require('dayjs');

const { Cherish, Water, water_log, sequelize } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const logger = require('../config/winston');

module.exports = {
  getCalendar: async (req, res) => {
    logger.info('GET /calendar/:id');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /calendar/:id - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const CherishId = req.params.id;

    try {
      const water = await Water.findAll({
        attributes: ['review', 'water_date', 'keyword1', 'keyword2', 'keyword3'],
        where: {
          CherishId: CherishId,
          active: 'Y',
        },
      });
      const cherish_water_date = await Cherish.findOne({
        attributes: ['water_date'],
        where: {
          id: CherishId,
        },
      });
      if (!cherish_water_date) {
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.CALENDAR_READ_FAIL_BY_ID));
      }
      const future_water_date = dayjs(cherish_water_date.water_date).format('YYYY-MM-DD');
      water.map((item) => {
        let waterDate = item.dataValues.water_date;
        item.dataValues.water_date = dayjs(waterDate).format('YYYY-MM-DD');
      });

      return res.status(sc.OK).send(
        ut.success(rm.CALENDAR_READ_SUCCESS, {
          water,
          future_water_date,
        })
      );
    } catch (error) {
      logger.error(`GET /calendar - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.CALENDAR_READ_FAIL));
    }
  },

  modifyCalendar: async (req, res) => {
    logger.info('PUT /calendar');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`PUT /calendar - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }

    const { CherishId, water_date, review, keyword1, keyword2, keyword3 } = req.body;

    const newWaterDate = dayjs(water_date).format('YYYY-MM-DD 09:00:00');
    try {
      await Water.update(
        {
          review: review,
          keyword1: keyword1,
          keyword2: keyword2,
          keyword3: keyword3,
        },
        {
          where: {
            CherishId: CherishId,
            water_date: newWaterDate,
          },
        }
      );
      const water = await Water.findOne({
        attributes: ['id'],
        where: {
          CherishId: CherishId,
          water_date: newWaterDate,
        },
      });
      // Water 테이블에 대한 Log
      await water_log.create({
        water_id: water.id,
        water_date: newWaterDate,
        review,
        keyword1,
        keyword2,
        keyword3,
        active: 'Y',
        status: 'UPDATE',
        service_name: 'modifyCalendar',
      });
      return res.status(sc.OK).send(ut.success(rm.CALENDAR_MODIFY_SUCCESS));
    } catch (error) {
      logger.error(`PUT /calendar - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.CALENDAR_MODIFY_FAIL));
    }
  },

  deleteCalendar: async (req, res) => {
    logger.info('DELETE /calendar');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`DELETE /calendar - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { CherishId, water_date } = req.body;

    const newWaterDate = dayjs(water_date).format('YYYY-MM-DD 09:00:00');
    try {
      const water = await Water.findOne({
        attributes: ['id', 'review', 'water_date', 'keyword1', 'keyword2', 'keyword3'],
        where: {
          CherishId: CherishId,
          water_date: newWaterDate,
          active: 'Y',
        },
      });
      await Water.update(
        {
          active: 'N',
        },
        {
          where: {
            CherishId: CherishId,
            water_date: newWaterDate,
            active: 'Y',
          },
        }
      );
      // Water 테이블에 대한 Log
      await water_log.create({
        water_id: water.id,
        CherishId,
        water_date: newWaterDate,
        review: water.review,
        keyword1: water.keyword1,
        keyword2: water.keyword2,
        keyword3: water.keyword3,
        active: 'N',
        service_name: 'deleteCalendar',
        status: 'DELETE',
        updatedAt: sequelize.fn('NOW'),
      });

      return res.status(sc.OK).send(ut.success(rm.CALENDAR_DELETE_SUCCESS));
    } catch (error) {
      logger.error(`DELETE /calendar - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.CALENDAR_DELETE_FAIL));
    }
  },
};
