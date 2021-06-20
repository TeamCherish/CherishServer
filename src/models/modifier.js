module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Modifier',
    {
      standard: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sentence: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'modifier',
    }
  );
};
