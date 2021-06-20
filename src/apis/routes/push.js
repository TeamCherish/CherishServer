const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const pushController = require('../../controller/pushController');

/**
 * @api {put} /
 * @apiName
 * @apiGroup
 */
router.get(
  '/:send_code/:notice_time',
  [check('send_code', 'send_code is required').not().isEmpty()],
  pushController.getPushUser
);

router.post(
  '/',
  [check('CherishId', 'CherishId is required').not().isEmpty()],
  pushController.contactCherish
);

router.put(
  '/',
  [check('CherishId', 'CherishId is required').not().isEmpty()],
  pushController.updateSendYN_COM
);

router.put(
  '/token',
  [check('UserId', 'UserId is required').not().isEmpty()],
  pushController.updateToken
);

router.post(
  '/insert',
  [check('CherishId', 'CherishId is required').not().isEmpty()],
  pushController.insertAppPushUserByCherishIdAndUserId
);

module.exports = router;
