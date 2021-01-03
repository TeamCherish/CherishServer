module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Water',
    {
      water_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      keyword1: {
        type: DataTypes.STRING(10),
        defaultValue: '',
      },
      keyword2: {
        type: DataTypes.STRING(10),
        defaultValue: '',
      },
      keyword3: {
        type: DataTypes.STRING(10),
        defaultValue: '',
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'water',
    }
  );
};
