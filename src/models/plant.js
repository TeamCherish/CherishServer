module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Plant',
    {
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      modifier: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      explanation: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      flower_meaning: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      thumbnail_image_url: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      gif: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      main_bg: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      active: {
        type: DataTypes.STRING(3),
        defaultValue: 'Y',
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'plant',
    }
  );
};
