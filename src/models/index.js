const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Plant_status = require('./plant_status')(sequelize, Sequelize);
db.Plant = require('./plant')(sequelize, Sequelize);
db.Plant_level = require('./plant_level')(sequelize, Sequelize);
db.Cherish = require('./cherish')(sequelize, Sequelize);
db.Water = require('./water')(sequelize, Sequelize);
db.Status_message = require('./status_message')(sequelize, Sequelize);
db.Modifier = require('./modifier')(sequelize, Sequelize);
db.App_push_user = require('./app_push_user')(sequelize, Sequelize);
db.water_log = require('./water_log')(sequelize, Sequelize);
db.user_log = require('./user_log')(sequelize, Sequelize);
db.cherish_log = require('./cherish_log')(sequelize, Sequelize);

/** 1 : N User : Cherish */
db.User.hasMany(db.Cherish);
db.Cherish.belongsTo(db.User);

/** 1 : N Plant_status : Plant */
db.Plant_status.hasMany(db.Plant);
db.Plant.belongsTo(db.Plant_status);

/** 1 : N Plant : Plant_level */
db.Plant.hasMany(db.Plant_level);
db.Plant_level.belongsTo(db.Plant);

/** 1 : N Plant : Cherish */
db.Plant.hasMany(db.Cherish);
db.Cherish.belongsTo(db.Plant);

/** 1 : N Cherish : Water */
db.Cherish.hasMany(db.Water);
db.Water.belongsTo(db.Cherish);

module.exports = db;
