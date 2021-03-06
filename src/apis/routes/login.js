const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const loginController = require('../../controller/loginController');

/**
 * @api {post} /login
 * @apiName signin
 * @apiGroup User
 */
router.post(
  '/signin',
  [
    check('email', 'email is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
  ],
  loginController.signin
);


router.post('/signup', loginController.signup);

/**
 * @api {post} /phoneAuth
 * @apiName phoneAuth
 * @apiGroup Login
 */
router.post(
  '/phoneAuth',
  [check('phone', 'phone is required').not().isEmpty()],
  loginController.phoneAuth
);
module.exports = router;
