const crypto = require('crypto');
const request = require('request');

const { User } = require('../models');

const secretKey = require('../config');

module.exports = {
  emailCheck: async ({ email }) => {
    try {
      const alreadyEmail = await User.findOne({
        where: {
          email,
        },
      });
      return alreadyEmail;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  signin: async ({ email, password }) => {
    try {
      const user = await User.findOne({
        where: {
          email,
          password,
        },
      });
      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  signup: async (email, password, sex, nickname, phone, birth) => {
    try {
      //const salt = crypto.randomBytes(64).toString('base64');
      //const saltPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
      const user = await User.create({
        email,
        password,
        sex,
        nickname,
        salt: '4321234',
        phone,
        birth,
      });
      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  /**
   * 인증 번호 보내기
   * @summary 핸드폰 인증을 위해 6자리 번호를 무작위로 보낸다.
   * @param 핸드폰 번호
   * @return 인증번호(6자리)
   */
  sendNumber: async ({ phone }) => {
    const NCP_accessKey = secretKey.NCP_API_ACCESS_KEY;
    const NCP_secretKey = secretKey.NCP_API_SECRET_KEY;
    const NCP_serviceID = secretKey.SENS_SERVICE_ID;
    const myPhoneNumber = secretKey.MY_PHONE_NUMBER;
    const space = ' '; // one space
    const newLine = '\n'; // new line
    const method = 'POST'; // method
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${NCP_serviceID}/messages`;
    // url (include query string)
    const url2 = `/sms/v2/services/${NCP_serviceID}/messages`;
    const timestamp = Date.now().toString(); // current timestamp (epoch)
    let message = [];
    let hmac = crypto.createHmac('sha256', NCP_secretKey);
    message.push(method);
    message.push(space);
    message.push(url2);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(NCP_accessKey);
    const signature = hmac.update(message.join('')).digest('base64');
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    try {
      request(
        {
          method: method,
          json: true,
          uri: url,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-iam-access-key': NCP_accessKey,
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-apigw-signature-v2': signature.toString(),
          },
          body: {
            type: 'SMS',
            contentType: 'COMM',
            countryCode: '82',
            subject: '인증 알림',
            from: myPhoneNumber,
            content: `체리쉬 인증번호 ${verifyCode}입니다.`,
            messages: [
              {
                to: phone,
              },
            ],
          },
        },
        function (err, res, html) {
          if (err) console.log('err : ', err);
          console.log('html : ', html);
        }
      );
      return verifyCode;
    } catch (err) {
      console.log(err);
      return 0;
    }
  },
};
