const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const postponeController = require('../../controller/postponeController');

/**
 * @api {put}/postpone
 * @apiName postponeWaterDate
 * @apiGroup postpone
 */
router.put(
  '/',
  [
    check('id', 'id is required').not().isEmpty(),
    check('postpone', 'postpone is required').not().isEmpty(),
    check('is_limit_postpone_number', 'is_limit_postpone_number is required').not().isEmpty(),
  ],
  postponeController.postponeWaterDate
);

/**
 * @api {get} /postpone
 * @apiName getPostponeCount
 * @apiGroup Postpone
 */
router.get(
  '/',
  [check('CherishId', 'CherishId is required').not().isEmpty()],
  postponeController.getPostpone
);
module.exports = router;
