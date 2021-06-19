const {
  Plant_level,
  Water,
  Cherish,
  Modifier,
  sequelize
} = require('../models');

module.exports = {
  getPlantLevel: ({
    growth
  }) => {
    try {
      let level;
      if ((growth >= 0) && (growth < 3)) {
        level = 1;
      } else if ((growth >= 3) && (growth < 7)) {
        level = 2;
      } else if ((growth >= 7) && (growth <= 12)) {
        level = 3;
      }
      return level;
    } catch (err) {
      throw err;
    }
  },

  getPlantStandard: ({
    dDay,
    waterCount
  }) => {
    try {
      let standard;
      if (waterCount == 0 && dDay >= 1) {
        standard = 1;
      } else if (waterCount != 0 && dDay >= 1) {
        standard = 2;
      } else if (dDay == 0) {
        standard = 3;
      } else {
        standard = 4;
      }
      return standard;
    } catch (err) {
      throw err;
    }
  },

  getPlantModifier: async ({
    standard
  }) => {
    try {
      const plantModifier = await Modifier.findOne({
        where: {
          standard: standard
        },
        order: sequelize.random(),
      });
      return plantModifier;
    } catch (err) {
      throw err;
    }
  },

  getWaterCount: async ({
    CherishId
  }) => {
    try {
      const waterCount = await Water.findAll({
        where: {
          CherishId: CherishId,
        },
      });
      return waterCount.length;
    } catch (err) {
      throw err;
    }
  },

  cherishCheck: async ({
    CherishId
  }) => {
    try {
      const alreadyCherish = await Cherish.findOne({
        where: {
          id: CherishId,
        },
      });
      return alreadyCherish;
    } catch (err) {
      throw err;
    }
  },

  getPlantId: ({
    cycle_date
  }) => {
    try {
      if (cycle_date <= 3) {
        plantId = 1;
      } else if (cycle_date <= 7) {
        plantId = 2;
      } else if (cycle_date <= 15) {
        plantId = 3;
      } else if (cycle_date <= 30) {
        plantId = 4;
      } else {
        plantId = 5;
      }
      return plantId;
    } catch (err) {
      throw err;
    }
  },
};