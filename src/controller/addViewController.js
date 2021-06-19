const { validationResult } = require('express-validator');

const { User, user_log, sequelize } = require('../models');
const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const logger = require('../config/winston');

module.exports = {
  /*
   * /addView
   * user 정보 수정 (더보기 뷰)
   *
   **/
  modifyUserNickname: async (req, res) => {
    logger.info('PUT /addview - modifyUserNickname');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`PUT /addview - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const userId = req.body.id;
    const { nickname } = req.body;

    try {
      await User.update(
        {
          nickname: nickname,
          updatedAt: sequelize.fn('NOW'),
        },
        {
          where: {
            id: userId,
            active: 'Y',
          },
        }
      );
      const user = await User.findOne({
        where: {
          id: userId,
          active: 'Y',
        },
      });
      await user_log.create({
        user_id: userId,
        name: user.name,
        email: user.email,
        password: user.password,
        salt: user.salt,
        nickname: user.nickname,
        phone: user.phone,
        sex: user.sex,
        birth: user.birth,
        profile_image_url: user.profile_image_url,
        postpone_count: user.postpone_count,
        fcm_token: user.fcm_token,
        active: user.active,
        status: 'UPDATE',
        service_name: 'modifyUserNickname',
      });
      return res.status(sc.OK).send(ut.success(rm.OK));
    } catch (err) {
      console.log(err);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
};
