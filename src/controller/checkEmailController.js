const { validationResult } = require('express-validator');

const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const userService = require('../service/userService');
const logger = require('../config/winston');

module.exports = {
  /* 이메일 입력, 중복확인 */
  checkSameEmail: async (req, res) => {
    logger.info('POST /checkSameEmail');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`POST /checkSameEmail - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const { email } = req.body;

    try {
      const alreadyEmail = await userService.emailCheck({
        email,
      });
      if (alreadyEmail) {
        console.log('이미 존재하는 이메일 입니다.');
        return res.status(sc.BAD_REQUEST).send(ut.fail(rm.ALREADY_EMAIL));
      }

      return res.status(sc.OK).send(ut.success(rm.CHECKED_EMAIL_SUCCESS));
    } catch (error) {
      console.error(error);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.CHECKED_EMAIL_FAIL));
    }
  },
};
