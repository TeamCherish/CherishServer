module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'water_log',
    {
      water_id: {
        type: DataTypes.INTEGER,
      },
      water_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      keyword1: {
        type: DataTypes.STRING(5),
        defaultValue: '',
        allowNull: false,
      },
      keyword2: {
        type: DataTypes.STRING(5),
        defaultValue: '',
        allowNull: false,
      },
      keyword3: {
        type: DataTypes.STRING(5),
        defaultValue: '',
        allowNull: false,
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
      tableName: 'water_log',
    }
  );
};
