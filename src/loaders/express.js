const express = require('express');
const helmet = require('helmet');
const api = require('../apis/routes');
const errorHandler = require('./error');
const { sequelize } = require('../models');
const logger = require('../config/winston');

module.exports = (app) => {
  /**
   * Database sync
   */
  sequelize.sync({
    alter: false,
  });
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/health', (req, res) => {
    logger.info('GET /health ');
    res.status(200).end();
  });
  app.head('/health', (req, res) => {
    logger.info('HEAD /health ');
    res.status(200).end();
  });
  app.use(helmet());
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(express.json());
  app.use('/', api);
  app.use(errorHandler);
};
