const {
  User
} = require('../models');

module.exports = {
  emailCheck: async (email) => {
    try {
      const alreadyEmail = await User.findOne({
        where: {
          email,
        }
      });
      return alreadyEmail;
    } catch (err) {
      throw err;
    }
  },

  signin: async (email, password) => {
    try {
      const user = await User.findOne({
        where: {
          email,
          password
        }
      });
      console.log(user);
      return user;
    } catch (err) {
      throw err;
    }
  }
}