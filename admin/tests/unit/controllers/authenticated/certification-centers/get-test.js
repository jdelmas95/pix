import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';
import sinon from 'sinon';

module.only('Unit | Controller | authenticated/certification-centers/get', function(hooks) {

  setupTest(hooks);

  let controller;

  hooks.beforeEach(function() {
    controller = this.owner.lookup('controller:authenticated/certification-centers/get');
  });

  module('#addCertificationCenterMembership', function() {

    test('it should create a certificationCenterMembership if the email is valid', function(assert) {
      // given
      const saveStub = sinon.stub();
      saveStub.resolves();
      const createRecordStub = sinon.stub();
      createRecordStub.returns({
        save: saveStub,
      });
      controller.store = Service.create({ createRecord: createRecordStub });
      const certificationCenter = { certificationCenterMemberships: { id: 1 } };
      controller.model = { certificationCenter };

      controller.userEmailToAdd = 'test@example.net';

      // when
      controller.addCertificationCenterMembership();

      // then
      assert.ok(createRecordStub.calledWith('certification-center-membership', { certificationCenter, user: { email: 'test@example.net' } }));
      assert.equal(saveStub.callCount, 1);
    });

    test('it should display an error message if the email is empty', function(assert) {

      // given
      const saveStub = sinon.stub();
      saveStub.resolves();
      const createRecordStub = sinon.stub();
      createRecordStub.returns({
        save: saveStub,
      });
      controller.store = Service.create({ createRecord: createRecordStub });
      const certificationCenter = { certificationCenterMemberships: { id: 1 } };
      controller.model = { certificationCenter };

      controller.userEmailToAdd = '';

      // when
      controller.addCertificationCenterMembership();

      // then
      assert.equal(controller.errorMessage, 'Ce champ est requis.');
    });

  });
});
