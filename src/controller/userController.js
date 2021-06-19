const { validationResult } = require('express-validator');
const dayjs = require('dayjs');

const { Cherish, Plant, Water, Plant_level, User, App_push_user } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const { plantService } = require('../service');
const logger = require('../config/winston');
const userService = require('../service/userService');

module.exports = {
  userMyPage: async (req, res) => {
    logger.info(`GET /user/:id - userMyPage`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /user/:id - Paramaters Error - userMyPage`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { id } = req.params;
    try {
      const user = await User.findOne({
        attributes: ['nickname', 'postpone_count', 'email'], // postpone_count
        where: {
          id: id,
          active: 'Y',
        },
      });

      const user_nickname = user.nickname;
      const postponeCount = user.postpone_count;
      const email = user.email;
      const cherishes = await Cherish.findAll({
        where: {
          UserId: id,
          active: 'Y',
        },
        include: [
          {
            model: Plant,
            include: [
              {
                model: Plant_level,
              },
            ],
          },
        ],
        attributes: ['id', 'nickname', 'growth', 'water_date', 'PlantId', 'phone'],
      });
      const result = [];
      cherishes.map(async (cherish) => {
        const obj = {};
        const level = plantService.getPlantLevel({
          growth: cherish.growth,
        });
        obj.id = cherish.id;
        const water_date = dayjs(cherish.water_date);
        const now_date_format = dayjs().format('YYYY-MM-DD 09:00:00');
        const now_date = dayjs(now_date_format);
        obj.dDay = water_date.diff(now_date, 'day');
        obj.nickname = cherish.nickname;
        obj.name =
          cherish && cherish.Plant && cherish.Plant.name ? cherish.Plant.name : '이름 없음';
        obj.thumbnail_image_url =
          cherish && cherish.Plant && cherish.Plant.thumbnail_image_url
            ? cherish.Plant.thumbnail_image_url
            : '썸네일 없음';
        obj.level = level;
        obj.PlantId = cherish.PlantId;
        obj.phone = cherish.phone;
        result.push(obj);
      });

      result.sort((a, b) => {
        let result = a.dDay - b.dDay;
        if (result === 0) {
          result = a.growth - b.growth;
        }
        return result;
      });

      const cherishIdList = cherishes.map((cherish) => cherish.id);
      const cherishCompleteList = cherishes.filter((cherish) => {
        return cherish.growth === 12;
      });

      const totalCherish = cherishes.length;
      const waterCount = await Water.count({
        where: {
          CherishId: cherishIdList,
          active: 'Y',
        },
      });
      const completeCount = cherishCompleteList.length;

      return res.status(sc.OK).send(
        ut.success(rm.READ_ALL_CHERISH_MY_PAGE_SUCCESS, {
          user_nickname,
          email,
          postponeCount,
          totalCherish,
          waterCount,
          completeCount,
          result,
        })
      );
    } catch (err) {
      console.log(err);
      logger.error(`GET /user/:id - Server Error - userMyPage`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
  updateFCMToken: async (req, res) => {
    logger.info(`PUT /user - updateFCMToken`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`PUT /user - Paramaters Error - updateFCMToken`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { id, fcm_token } = req.body;
    try {
      await User.update(
        {
          fcm_token,
        },
        {
          where: {
            id,
            active: 'Y',
          },
        }
      );
      await App_push_user.update(
        {
          mobile_device_token: fcm_token,
        },
        {
          where: {
            UserId: id,
            send_yn: 'N',
            active: 'Y',
          },
        }
      );
      return res.status(sc.OK).send(ut.success(rm.UPDATE_TOKEN_SUCCESS));
    } catch (err) {
      console.log(err);
      logger.error(`PUT /user - Server Error - updateFCMToken`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
  deleteUser: async (req, res) => {
    logger.info(`DELETE /user - deleteUser`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`DELETE /user - Paramaters Error - deleteUser`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { id } = req.body;
    try {
      await userService.deleteUser({ id });
      return res.status(sc.OK).send(ut.success(rm.DELETE_USER_SUCCESS));
    } catch (err) {
      console.log(err);
      logger.error(`DELETE /user - Server Error - deleteUser`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
};
