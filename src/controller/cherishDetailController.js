const { Cherish } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const dayjs = require('dayjs');

module.exports = {
  getCherishDetail: async (req, res) => {
    const { CherishId } = req.params;

    try {
      const cherishDetail = await Cherish.findOne({
        attributes: ['nickname', 'birth', 'phone', 'cycle_date', 'notice_time', 'water_notice'],
        where: {
          id: CherishId,
          active: 'Y',
        },
      });

      cherishDetail.dataValues.birth = dayjs(cherishDetail.dataValues.birth).format('YYYY-MM-DD');

      return res.status(sc.OK).send(
        ut.success(rm.READ_ALL_CHERISH_BY_ID_SUCCESS, {
          cherishDetail,
        })
      );
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
};
