module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Plant_status',
    {
      cycle: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'plant_status',
    }
  );
};
