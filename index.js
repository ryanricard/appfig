const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { Provider } = require('nconf');
const recurpolate = require('recurpolate');
const { defaultsDeep } = require('lodash');

const getJsonExtendsOrder = (configDirPath, jsonFilePath, prevJsonFilePath, prevFileJson = {}) => {
  const result = [jsonFilePath];
  let fileJson;

  try {
    fileJson = fs.readFileSync(jsonFilePath, 'utf8');
  } catch (err) {
    if (prevFileJson.extends) {
      throw new Error(
        `Parent config "${prevFileJson.extends}" not found for child ${prevJsonFilePath}`
      );
    }
    throw new Error(`Config file ${jsonFilePath} not found`);
  }

  try {
    fileJson = JSON.parse(fileJson);
  } catch (err) {
    throw new Error(`Config file "${jsonFilePath}" invalid JSON`);
  }

  if (fileJson.extends) {
    const nextJsonFilePath = path.join(configDirPath, `${fileJson.extends}.json`);
    return result.concat(
      getJsonExtendsOrder(configDirPath, nextJsonFilePath, jsonFilePath, fileJson)
    );
  }

  return result;
};

function recurp(nconf) {
  const config = nconf.get();
  const recurpolated = recurpolate(config);
  Object.keys(recurpolated).forEach(key => nconf.set(key, recurpolated[key]));
  return nconf;
}

function prepareOptions(options) {
  if (options.configDirPath) {
    assert(
      path.isAbsolute(options.configDirPath),
      'Optional configuration `options.configDirPath` must be an absolute path when provided.'
    );
  }

  // deep merge default object
  return defaultsDeep(
    {
      nconf: {
        argv: {},
        env: {}
      }
    },
    options
  );
}

function discernConfigDirPath(configFilePath, configDirPath = '') {
  // return configDirPath when `options.configDirPath` is configured
  if (configDirPath) return configDirPath;
  // else assume relative to configFilePath
  const pathSegments = configFilePath.split('/');
  pathSegments.pop();
  return pathSegments.join('/');
}

module.exports = function appfig(configFilePath, options = {}, afterConfigLoaded) {
  // prepare options
  const _options = prepareOptions(options);
  const { nconf: nconfOptions } = _options;
  const { argv: argvOptions, env: envOptions } = nconfOptions;

  // assign path to configuration directory
  const configDirPath = discernConfigDirPath(configFilePath, _options.configDirPath);

  // determine json extends order
  const jsonExtendsOrder = getJsonExtendsOrder(configDirPath, configFilePath);

  // instantiate new isolated instance of nconf
  const nconf = new Provider();

  // load configuration with careful attention to precedence
  nconf
    // 1. load argv into nconf hierarchy
    .argv(argvOptions)
    // 2. load argv into nconf hierarchy
    .env(envOptions);

  // 3. load json files into nconf hierarchy with special attention to extends order
  jsonExtendsOrder.forEach((file, index) => nconf.file(`__file${index}__`, { file }));

  // after config is loaded, provide consumer opportunity to customize the loaded config via callback
  if (typeof afterConfigLoaded === 'function') afterConfigLoaded(nconf);

  // recurpolate config to provide self referential interpolation
  recurp(nconf);

  // return nconf instance
  return nconf;
};
