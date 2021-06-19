const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'App_push_user',
    {
      send_code: {
        type: DataTypes.STRING(50),
      },
      push_date: {
        type: DataTypes.DATE,
      },
      mobile_os_type: {
        type: DataTypes.STRING(200),
      },
      mobile_device_token: {
        type: DataTypes.STRING(200),
      },
      send_yn: {
        type: DataTypes.STRING(2),
      },
      title: {
        type: DataTypes.STRING(50),
      },
      message: {
        type: DataTypes.STRING(50),
      },
      active: {
        type: DataTypes.STRING(3),
        defaultValue: 'Y',
        allowNull: false,
      },
      CherishId: {
        type: DataTypes.INTEGER,
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
      tableName: 'app_push_user',
    }
  );
};
