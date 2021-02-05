import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/sessions/list/to-be-published', function(hooks) {
  setupTest(hooks);

  module('#model', function(hooks) {
    test('it should fetch the list of sessions to be published', async function(assert) {
      // given
      const route = this.owner.lookup('route:authenticated/sessions/list/to-be-published');
      const publishableSessions = [{
        certificationCenterName: "Centre SCO des Anne-Solo",
        finalizedAt: "2020-04-15T15:00:34.000Z",
      }];
      sinon.stub(route.store, 'findAll').withArgs('publishable-session').resolves(publishableSessions);

      // when
      const result = await route.model();

      // then
      assert.equal(result, publishableSessions);
    });
  });
});
