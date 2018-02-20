const { expect } = require('chai');
const appfig = require('../');
const { developmentConfigPath } = require('./fixtures/paths');

describe('recurpolation', () => {
  it('should recurpolate expressions', () => {
    const config = appfig(developmentConfigPath);

    expect(config.get('recurp')).to.equal('baa-baz');
  });
});
