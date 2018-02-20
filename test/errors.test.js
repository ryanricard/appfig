const path = require('path');
const { expect } = require('chai');
const appfig = require('../');

const {
  developmentConfigPath,
  orphanedConfigPath,
  invalidConfigPath
} = require('./fixtures/paths');

describe('errors', () => {
  describe('file error handling', () => {
    it('should throw an exception when dependent file cannot be found', () => {
      const errorMessage = `Parent config "non-existent" not found for child ${orphanedConfigPath}`;
      expect(appfig.bind(null, orphanedConfigPath)).to.throw(errorMessage);
    });

    it('should throw an exception when a file is not valid JSON', () => {
      const errorMessage = `Config file "${invalidConfigPath}" invalid JSON`;
      expect(appfig.bind(null, invalidConfigPath)).to.throw(errorMessage);
    });
  });

  describe('options error handling', () => {
    it('should not throw validation exception when `options.configDirPath` is not provided', () => {
      expect(appfig.bind(null, developmentConfigPath)).to.not.throw();
    });

    it('should throw validation exception when `options.configDirPath` is provided and is not a absolute path', () => {
      expect(
        appfig.bind(null, developmentConfigPath, {
          configDirPath: 'not/absolute/path'
        })
      ).to.throw(
        'Optional configuration `options.configDirPath` must be an absolute path when provided.'
      );
    });

    it('should not throw validation exception when `options.configDirPath` is an absolute path', () => {
      expect(
        appfig.bind(null, developmentConfigPath, {
          configDirPath: path.join(__dirname, './fixtures/config')
        })
      ).to.not.throw();
    });
  });
});
