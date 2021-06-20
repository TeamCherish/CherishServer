const { Water, water_log } = require('../models');
const dayjs = require('dayjs');

module.exports = {
  postWater: async (CherishId, water_date, review, keyword1, keyword2, keyword3) => {
    try {
      //water_date 구하기
      const waterDate = dayjs(water_date).format('YYYY-MM-DD 09:00:00');

      const water = await Water.create({
        CherishId,
        review,
        keyword1,
        keyword2,
        keyword3,
        water_date: waterDate,
      });

      const waterInfo = await Water.findOne({
        where: {
          CherishId: CherishId,
          water_date: waterDate,
        },
      });
      // Water 테이블에 대한 Log
      await water_log.create({
        water_id: waterInfo.id,
        water_date: waterInfo.water_date,
        review,
        keyword1,
        keyword2,
        keyword3,
        active: 'Y',
        status: 'CREATE',
        service_name: 'postWater',
      });
      return water;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
