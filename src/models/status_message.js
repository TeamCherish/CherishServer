module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Status_message',
    {
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'status_message',
    }
  );
};
