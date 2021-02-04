import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';

describe('Unit | Route | competences/index', function() {
  setupTest();

  it('should redirect to competences.details', async function() {
    // given
    const route = this.owner.lookup('route:competences/index');
    route.replaceWith = sinon.stub().resolves();

    // when
    await route.beforeModel();

    // then
    sinon.assert.calledWith(route.replaceWith, 'competences.details');
  });
});
