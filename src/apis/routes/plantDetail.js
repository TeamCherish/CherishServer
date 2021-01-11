const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const plantViewController = require('../../controller/plantViewController');

/**
 * @api {get} /plant/:id
 * @apiName getPlant
 * @apiGroup Plant_level
 */
router.get(
  '/:id',
  [check('id', 'id is required').not().isEmpty()],
  plantViewController.getPlantDetail
);

module.exports = router;
