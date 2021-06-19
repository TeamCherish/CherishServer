const { Plant_status, Cherish, Modifier, App_push_user, sequelize, User } = require('../models');

module.exports = {
  createPushCOM: async ({ UserId, CherishId, water_date }) => {
    try {
      const mobile_device_token = await User.findOne({
        attributes: ['fcm_token'],
        where: {
          id: UserId,
        },
      });

      await App_push_user.create({
        send_code: 'COM',
        push_date: water_date,
        mobile_os_type: 'I',
        mobile_device_token: mobile_device_token.dataValues.fcm_token,
        send_yn: 'N',
        title: '물줄 시간 입니다',
        message: '물줄 시간 입니다.',
        CherishId: CherishId,
        UserId: UserId,
      });
    } catch (err) {
      throw err;
    }
  },

  createPushREV: async ({ UserId, CherishId, push_date }) => {
    try {
      const mobile_device_token = await User.findOne({
        attributes: ['fcm_token'],
        where: {
          id: UserId,
        },
      });

      await App_push_user.create({
        send_code: 'REV',
        push_date: push_date,
        mobile_os_type: 'I',
        mobile_device_token: mobile_device_token.dataValues.fcm_token,
        send_yn: 'N',
        title: '연락 후기를 등록해보세요',
        message: '연락 후기를 등록해보세요.',
        CherishId: CherishId,
        UserId: UserId,
      });
    } catch (err) {
      throw err;
    }
  },

  updatePushCom: async ({ CherishId, push_date }) => {
    try {
      await App_push_user.update(
        {
          push_date,
        },
        {
          where: {
            send_yn: 'N',
            CherishId,
            send_code: 'COM',
          },
        }
      );
    } catch (err) {
      throw err;
    }
  },

  updatePushREV: async ({ UserId, CherishId }) => {
    try {
      await App_push_user.update(
        {
          send_yn: 'Y',
        },
        {
          where: {
            UserId,
            CherishId,
            send_code: 'REV',
          },
        }
      );
    } catch (err) {
      throw err;
    }
  },

  updatePushFcmToken: async ({ UserId }) => {
    try {
      await App_push_user.update(
        {
          mobile_device_token: '',
        },
        {
          where: {
            UserId,
            active: 'Y',
          },
        }
      );
    } catch (err) {
      throw err;
    }
  },

  deletePushByCherishId: async ({ CherishId }) => {
    try {
      await App_push_user.update(
        {
          active: 'N',
        },
        {
          where: {
            send_yn: 'N',
            CherishId,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  },
};
