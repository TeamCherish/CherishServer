const { validationResult } = require('express-validator');

const { Plant_level, Plant } = require('../models');

const ut = require('../modules/util');
const sc = require('../modules/statusCode');
const rm = require('../modules/responseMessage');
const plant = require('../models/plant');
const logger = require('../config/winston');

module.exports = {
  getPlantDetail: async (req, res) => {
    logger.error(`GET /plantDetail/:id`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`GET /plantDetail/:id - Paramaters Error`);
      return res.status(400).json({
        success: false,
        message: errors.array(),
      });
    }
    const id = req.params.id;

    try {
      const plantResult = await Plant.findOne({
        attributes: ['modifier', 'flower_meaning', 'explanation', 'image'],
        where: {
          id: id,
          active: 'Y',
        },
      });
      const plantRes = {};

      const mod = plantResult.dataValues.modifier;
      const modi = mod.split('\n ')[1];
      plantRes.modifier = modi;

      const exp = plantResult.dataValues.explanation;
      const explain = exp.split('\n')[0];
      plantRes.explanation = explain;

      plantRes.flower_meaning = plantResult.dataValues.flower_meaning;
      plantRes.image = plantResult.dataValues.image;

      const plantResponse = [];
      plantResponse.push(plantRes);

      const plantImage = await Plant_level.findOne({
        attributes: ['image_url'],
        where: {
          PlantId: id,
          level: 2,
        },
      });

      const plantDetail = await Plant_level.findAll({
        attributes: ['level_name', 'description', 'image_url', 'image'],
        where: {
          PlantId: id,
        },
      });

      plantRes.image_url = plantImage.dataValues.image_url;

      return res
        .status(sc.OK)
        .send(ut.success(rm.PLANT_DERAIL_READ_SUCCESS, { plantResponse, plantDetail }));
    } catch (err) {
      console.log(err);
      logger.error(`GET /plantView - Server Error`);
      return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(rm.INTERNAL_SERVER_ERROR));
    }
  },
};
