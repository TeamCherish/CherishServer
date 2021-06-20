const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'cherish_log',
    {
      cherish_id: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      birth: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: '0000-00-00',
      },
      phone: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      growth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cycle_date: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      water_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      postpone_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      notice_time: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      water_notice: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      active: {
        type: DataTypes.STRING(3),
        defaultValue: 'Y',
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      service_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'cherish_log',
    }
  );
};
