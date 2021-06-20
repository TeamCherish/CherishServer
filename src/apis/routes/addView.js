const express = require('express');

const router = express.Router();
const { check } = require('express-validator');
const addViewController = require('../../controller/addViewController');

/**
 * @api {PUT} /addView
 * @apiName modifyUserNickname
 * @apiGroup modifyUserNickname
 */

router.put(
  '/',
  [
    check('id', 'id is required').not().isEmpty(),
    check('nickname', 'nickname is required').not().isEmpty(),
  ],
  addViewController.modifyUserNickname
);
module.exports = router;
