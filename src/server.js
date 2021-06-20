const express = require('express');
const config = require('./config');
const loader = require('./loaders');
const logger = require('./config/winston');
async function startServer() {
  const app = express();

  await loader(app);

  app
    .listen(config.PORT, () => {
      logger.info(`✌️ Server listening on port: ${config.PORT}`);
    })
    .on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();
