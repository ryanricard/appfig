const path = require('path');

module.exports = {
  baseConfigPath: path.join(__dirname, 'config/base.json'),
  developmentConfigPath: path.join(__dirname, 'config/development.json'),
  invalidConfigPath: path.join(__dirname, 'config/invalid.json'),
  orphanedConfigPath: path.join(__dirname, 'config/orphaned.json'),
  secondaryConfigPath: path.join(__dirname, 'secondary.json')
};
