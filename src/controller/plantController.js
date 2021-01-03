const { validationResult } = require('express-validator');
const dayjs = require('dayjs');

const { Cherish, Plant, Water, sequelize } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');

module.exports = {
  /**
   * body: name, nickname, birth, phone, cycle_date, notice_time
   */
  createPlant: async (req, res) => {
    const { name, nickname, birth, phone, cycle_date, notice_time } = req.body;
    try {
      if (!name || !nickname || !birth || !phone || !cycle_date || !notice_time) {
        console.log('필요한 값이 없습니다.');
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.NULL_VALUE));
      }
      const PlantId = 1; //식물 추천해주는 알고리즘 넣으면 대체
      const UserId = 1;
      const cherish = await Cherish.create({
        name,
        nickname,
        birth,
        phone,
        cycle_date,
        notice_time,
        PlantId,
        UserId,
      });
      const plant = await Plant.findOne({
        id: PlantId,
        attributes: ['name', 'explanation', 'thumbnail_image_url'],
      });
      return res.status(sc.OK).send(ut.success(rm.OK, { nickname, plant }));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
  getWaterPossible: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { cherish_id } = req.query;
    const t = await sequelize.transaction();
    try {
      const cherish = await Cherish.findOne({
        attributes: ['postpone_number'],
        where: {
          id: cherish_id,
        },
      });
      const is_limit_postpone_number = cherish && cherish.postpone_number >= 3 ? true : false;

      // 이미 미루기 횟수가 초과된 경우
      if (is_limit_postpone_number) {
        return res.status(sc.OK).send(ut.fail(rm.IMPOSSIBLE_WATER_POSTPONE));
      }
      return res.status(sc.OK).send(ut.success(rm.POSSIBLE_WATER_POSTPONE, { cherish }));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },

  getCherishInfo: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { cherish_id } = req.query;
    try {
      const cherish = await Cherish.findOne({
        attributes: ['name', 'nickname', 'birth', 'plant_id', 'start_date', 'water_date'],
        where: {
          id: cherish_id,
        },
      });
      const result = {};
      result.name = cherish.name;
      result.nickname = cherish.nickname;

      /**
       * birth Format MM.DD로 변경
       * 접근하려면 dataValues로 접근해야 합니다.
       */
      result.birth = dayjs(cherish.birth).format('MM.DD');

      /**
       * start_date로 경과일(duration) 구하기
       */
      const start_date = dayjs(cherish.start_date);
      const now_date = dayjs();
      result.duration = now_date.diff(start_date, 'day');

      /**
       * water_date로 디데이(dDay) 구하기
       */
      const water_date = dayjs(cherish.water_date);
      result.dDay = water_date.diff(now_date, 'day');

      // 식물 이름(plant_name), 식물 썸네일 사진(plant_thumbnail_image_url)
      const plant = await Plant.findOne({
        attributes: ['name', 'thumbnail_image_url'],
        where: {
          id: cherish.dataValues.plant_id,
        },
      });
      result.plant_name = plant.name;
      result.plant_thumbnail_image_url = plant.thumbnail_image_url;

      // 메모(water) 가져오기
      const water = await Water.findAll({
        attributes: ['id', 'review', 'water_date', 'keyword1', 'keyword2', 'keyword3'],
        where: {
          cherish_id: cherish_id,
        },
        // order: [['id', 'DESC']],
      });
      if (water) {
        result.keyword1 = water[0].keyword1;
        result.keyword2 = water[0].keyword2;
        result.keyword3 = water[0].keyword3;
        water.map((w, i) => {
          water[i].dataValues.water_date = dayjs(w.water_date).format('MM/DD');
        });
        result.reviews = water;
      }
      return res.status(sc.OK).send(ut.success(rm.READ_ALL_CHERISH_BY_ID_SUCCESS, result));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
};
