const jwt = require('jsonwebtoken')
const secretKey = require('../../config');
const express = require('express');

const router = express.Router();
const rm = require('../../modules/responseMessage');
const sc = require('../../modules/statusCode');
const ut = require('../../modules/util');

router.post('/token', async (req, res) => {
  try {   
      const { token } = req.body;
      //토큰 유효성 검사
      let decodedPayload = jwt.verify(token, secretKey.JWT_SECRET)
      //만약 유효하면 새 토큰 발행
      const newToken = await jwt.sign({
        decodedPayload,
      }, secretKey.JWT_SECRET,{
          expiresIn: '15m',
          issuer: 'TL',
      });
      return res.status(sc.OK).send(
        ut.success(rm.SUCCESS_TOKEN, {
          newToken
        })
      );
  }  catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(sc.UNAUTHORIZED).send(ut.fail(rm.EXPIRED_TOKEN));
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(sc.UNAUTHORIZED).send(ut.fail(rm.INVALID_TOKEN));;
    } else {
        return res.status(sc.UNAUTHORIZED).send(ut.fail(rm.INVALID_TOKEN));
    }
  }
},
)

module.exports = router;