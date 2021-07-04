import assert from 'assert';
import app from '../../src/app';

describe('\'listitem\' service', () => {
  it('registered the service', () => {
    const service = app.service('listitem');

    assert.ok(service, 'Registered the service');
  });
});
