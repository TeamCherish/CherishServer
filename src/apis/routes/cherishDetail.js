const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const cherishDetailController = require('../../controller/cherishDetailController');

/**
 * @api {get}/getCherishDetail/:id
 * @apiName getCherishDetail
 * @apiGroup getCherishDetail
 */
//router.get('/', [check('id', 'id is required').not().isEmpty()], userDetailController.getUserDetail);
router.get('/:CherishId', cherishDetailController.getCherishDetail);

module.exports = router;
