const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const plantController = require('../../controller/plantController');

/**
 * @api {post} /cherish
 * @apiName createPlant
 * @apiGroup Cherish
 */
router.post('/', plantController.createPlant);

/**
 * @api {get} /cherish/postpone
 * @apiName getWaterLimit
 * @apiGroup Cherish
 */
router.get(
  '/postpone',
  [check('cherish_id', 'cherish_id is required').not().isEmpty()],
  plantController.getWaterPossible
);

/**
 * @api {get} /cherish
 * @apiName getCherishInfo
 * @apiGroup Cherish
 */
router.get(
  '/',
  [check('cherish_id', 'cherish_id is required').not().isEmpty()],
  plantController.getCherishInfo
);

module.exports = router;
