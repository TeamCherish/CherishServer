const express = require('express');

const router = express.Router();

router.use('/cherish', require('./cherish'));

router.use('/water', require('./water'));

router.use('/login', require('./login'));

router.use('/postpone', require('./postpone'));

router.use('/calendar', require('./calendar'));

router.use('/user', require('./user'));

router.use('/plantDetail', require('./plantDetail'));

router.use('/search', require('./search'));

router.use('/contact', require('./contact'));

router.use('/push', require('./push'));

router.use('/pushReview', require('./pushReview'));

router.use('/getCherishDetail', require('./cherishDetail'));

router.use('/checkSameEmail', require('./checkEmail'));

router.use('/addView', require('./addView'));

router.use('/token', require('./token'));

module.exports = router;