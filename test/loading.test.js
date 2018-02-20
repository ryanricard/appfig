const { exec } = require('child_process');
const { expect } = require('chai');
const appfig = require('../');

const { baseConfigPath, developmentConfigPath, secondaryConfigPath } = require('./fixtures/paths');

describe('loading', () => {
  it('should load configuration files', () => {
    const config = appfig(baseConfigPath);

    expect(config.get('name')).to.equal('base');
  });

  it('should load configuration files from varying locations', () => {
    const config = appfig(secondaryConfigPath);

    expect(config.get('name')).to.equal('other');
    expect(config.get('other')).to.be.true;
    expect(config.get('base')).to.be.true;
  });

  it('should load shell environment variables', function(done) {
    exec(
      `echo "
          const appfig = require('./');
          const config = appfig('${developmentConfigPath}');
          console.log(config.get('FOO'));
        " | FOO=envbar node`,
      (err, stdout, stderr) => {
        expect(stdout).to.match(/^envbar\s$/);
        done();
      }
    );
  });

  it('should load command arguments', function(done) {
    exec(
      `echo "
          const appfig = require('./');
          const config = appfig('${developmentConfigPath}');
          console.log(config.get('FOO'));
        " | node - --FOO=argvbar`,
      (err, stdout, stderr) => {
        expect(stdout).to.match(/^argvbar\s$/);
        done();
      }
    );
  });
});
