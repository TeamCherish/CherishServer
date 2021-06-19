const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const waterController = require('../../controller/waterController');

/**
 * @api {post} /water
 * @apiName postWater
 * @apiGroup Water
 */
router.post(
  '/',
  [check('CherishId', 'CherishId is required').not().isEmpty()],
  waterController.postWater
);

/**
 * @api {get} /water/:id
 * @apiName getWater
 * @apiGroup Water
 */
router.get('/:id', [check('id', 'id is required').not().isEmpty()], waterController.getWater);

module.exports = router;
