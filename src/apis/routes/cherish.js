const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const plantController = require('../../controller/plantController');

/**
 * @api {put} /cherish
 * @apiName modifyCherish
 * @apiGroup Cherish
 */
router.put(
  '/',
  [
    check('id', 'id is required').not().isEmpty(),
    check('nickname', 'nickname is required').not().isEmpty(),
    check('birth', 'birth is required').not().isEmpty(),
    check('cycle_date', 'cycle_date is required').not().isEmpty(),
    check('water_notice', 'water_notice is required').not().isEmpty(),
    check('notice_time', 'notice_time is required').not().isEmpty(),
  ],
  plantController.modifyCherish
);

/**
 * @api {post} /cherish
 * @apiName createPlant
 * @apiGroup Cherish
 */
router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
    check('nickname', 'nickname is required').not().isEmpty(),
    check('phone', 'phone is required').not().isEmpty(),
    check('birth', 'birth is required').not().isEmpty(),
    check('cycle_date', 'cycle_date is required').not().isEmpty(),
    check('water_notice', 'water_notice is required').not().isEmpty(),
    check('notice_time', 'notice_time is required').not().isEmpty(),
    check('UserId', 'UserId is required').not().isEmpty(),
  ],
  plantController.createPlant
);

/**
 * @api {delete} /cherish/:id
 * @apiName deleteCherish
 * @apiGroup Cherish
 */
router.delete(
  '/:id',
  [check('id', 'id is required').not().isEmpty()],
  plantController.deleteCherish
);

/**
 * @api {get} /cherish?CherishId=?
 * @apiName getCherishInfo
 * @apiGroup Cherish
 */
router.get(
  '/',
  [check('CherishId', 'CherishId is required').not().isEmpty()],
  plantController.getCherishInfo
);

/**
 * @api {get} /cherish/:id
 * @apiName getCherishList
 * @apiGroup Cherish
 */
router.get(
  '/:id',

  [check('id', 'id is required').not().isEmpty()],
  plantController.getCherishList
);

/**
 * @api {post} /cherish/checkPhone
 * @apiName checkPhone
 * @apiGroup Cherish
 */
router.post(
  '/checkPhone',
  [
    check('phone', 'phone is required').not().isEmpty(),
    check('UserId', 'UserId is required').not().isEmpty(),
  ],
  plantController.checkPhone
);

module.exports = router;
