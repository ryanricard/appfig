const { exec } = require('child_process');
const { expect } = require('chai');
const { developmentConfigPath } = require('./fixtures/paths');

describe('configuration', () => {
  describe('nconf options', () => {
    it('should faciliate nconf `.env()` options', function(done) {
      exec(
        `echo "
          const appfig = require('./');
          const config = appfig('${developmentConfigPath}', {
            nconf: {
              env: {
                whitelist: ['NODE_ENV']
              }
            }
          });
          console.log(config.get('NODE_ENV'));
          console.log(config.get('OTHER_ENV'));
        " | NODE_ENV=dev OTHER_ENV=true node`,
        (err, stdout, stderr) => {
          expect(stdout).to.match(/^dev\sundefined\s$/);
          done();
        }
      );
    });

    it('should faciliate nconf `.argv()` options', function(done) {
      exec(
        `echo "
          const appfig = require('./');
          const config = appfig('${developmentConfigPath}', {
            nconf: {
              argv: {
                foo: {
                  default: 'bar'
                }
              }
            }
          });
          console.log(config.get('foo'));
        " | node`,
        (err, stdout, stderr) => {
          expect(stdout).to.match(/^bar\s$/);
          done();
        }
      );
    });
  });
});
