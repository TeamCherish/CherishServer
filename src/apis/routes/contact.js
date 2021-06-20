const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const contactController = require('../../controller/contactController');

/**
 * @api {get} /contact/:id
 * @apiName getNewKeyword
 * @apiGroup Contact
 */
router.get(
  '/:id',
  [check('id', 'id is required').not().isEmpty()],
  contactController.getNewKeyword
);

module.exports = router;
