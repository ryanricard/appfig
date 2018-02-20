const { exec } = require('child_process');
const { expect } = require('chai');
const appfig = require('../');

const { developmentConfigPath } = require('./fixtures/paths');

describe('precedence', () => {
  it('should sanity check loading json configuration overridden in subsequent tests', () => {
    const config = appfig(developmentConfigPath);

    expect(config.get('name')).to.equal('development');
  });

  it('should correctly load multiple dependent configuration files', () => {
    const config = appfig(developmentConfigPath);

    expect(config.get('name')).to.equal('development');
    expect(config.get('development')).to.be.true;
    expect(config.get('intermediary')).to.be.true;
    expect(config.get('base')).to.be.true;
  });

  it('should load shell environment variables with precedence over json files', function(done) {
    exec(
      `echo "
          const appfig = require('./');
          const config = appfig('${developmentConfigPath}');
          console.log(config.get('name'));
        " | name=shell node`,
      (err, stdout, stderr) => {
        expect(stdout).to.match(/^shell\s$/);
        done();
      }
    );
  });

  it('should load command arguments with precedence over json files', function(done) {
    exec(
      `echo "
          const appfig = require('./');
          const config = appfig('${developmentConfigPath}');
          console.log(config.get('name'));
        " | node - --name=argv`,
      (err, stdout, stderr) => {
        expect(stdout).to.match(/^argv\s$/);
        done();
      }
    );
  });

  it('should load command arguments with precedence over shell environment variables', function(done) {
    exec(
      `echo "
          const appfig = require('./');
          const config = appfig('${developmentConfigPath}');
          console.log(config.get('FOO'));
        " | FOO=bar1 node - --FOO=bar2`,
      (err, stdout, stderr) => {
        expect(stdout).to.match(/^bar2\s$/);
        done();
      }
    );
  });

  it('should load command arguments with precedence over shell environment variables and json files', function(done) {
    exec(
      `echo "
          const appfig = require('./');
          const config = appfig('${developmentConfigPath}');
          console.log(config.get('name'));
        " | name=shell node - --name=argv`,
      (err, stdout, stderr) => {
        expect(stdout).to.match(/^argv\s$/);
        done();
      }
    );
  });
});
