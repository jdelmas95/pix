import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import sinon from 'sinon';

describe('Unit | Route | assessments/index', function() {
  setupTest();

  it('should redirect to assessments.resume', async function() {
    // given
    const route = this.owner.lookup('route:assessments/index');
    route.replaceWith = sinon.stub().resolves();

    // when
    await route.beforeModel();

    // then
    sinon.assert.calledWith(route.replaceWith, 'assessments.resume');
  });
});
