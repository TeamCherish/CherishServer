const express = require('express');

const router = express.Router();
const { check } = require('express-validator');

const calendarController = require('../../controller/calendarController');

/**
 * @api {GET} /calendar
 * @apiName getCalendar
 * @apiGroup Calendar
 */
router.get('/:id', [check('id', 'id is required').not().isEmpty()], calendarController.getCalendar);

/**
 * @api {PUT} /calendar
 * @apiName modifyCalendar
 * @apiGroup Calendar
 */
router.put(
  '/',
  [
    check('CherishId', 'CherishId is required').not().isEmpty(),
    check('water_date', 'water_date is required').not().isEmpty(),
  ],
  calendarController.modifyCalendar
);

/**
 * @api {DELELE} /calendar
 * @apiName deleteCalendar
 * @apiGroup Calendar
 */
router.delete(
  '/',
  [
    check('CherishId', 'CherishId is required').not().isEmpty(),
    check('water_date', 'water_date is required').not().isEmpty(),
  ],
  calendarController.deleteCalendar
);

module.exports = router;
