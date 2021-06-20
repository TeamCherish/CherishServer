module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      profile_image_url: {
        type: DataTypes.STRING(200),
      },
      postpone_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      fcm_token: {
        type: DataTypes.STRING(200),
      },
      active: {
        type: DataTypes.STRING(3),
        defaultValue: 'Y',
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'user',
    }
  );
};
