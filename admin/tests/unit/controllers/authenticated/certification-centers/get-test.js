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

  module('#addCertificationCenterMembership', function(hooks) {

    let certificationCenter;
    let certificationCenterMemberships;
    let createRecordStub;
    let reloadStub;
    let saveStub;

    hooks.beforeEach(function() {
      createRecordStub = sinon.stub();
      reloadStub = sinon.stub();
      saveStub = sinon.stub();

      reloadStub.resolves();
      saveStub.resolves();
      createRecordStub.returns({
        save: saveStub,
      });

      controller.store = Service.create({
        createRecord: createRecordStub,
      });

      certificationCenter = { id: 1, certificationCenterMemberships: { id: 1 } };
      certificationCenterMemberships = {
        id: 1,
        reload: reloadStub,
      };
      controller.model = {
        certificationCenter,
        certificationCenterMemberships,
      };
    });

    module('when email is valid', function() {

      test('should create a certificationCenterMembership', function(assert) {
        // given
        const email = 'test@example.net';
        controller.userEmailToAdd = email;
        const expectedArguments = {
          adapterOptions: {
            certificationCenterId: 1,
            email,
          },
        };

        // when
        controller.addCertificationCenterMembership();

        // then
        sinon.assert.calledWith(createRecordStub, 'certification-center-membership');
        sinon.assert.calledWith(saveStub, expectedArguments);
        sinon.assert.called(reloadStub);
        assert.ok(true);
      });

      test('should not have an error message', function(assert) {
        // given
        controller.userEmailToAdd = 'test@example.net';

        // when
        controller.addCertificationCenterMembership();

        // then
        assert.equal(controller.errorMessage, null);
      });
    });

    module('when email is not valid', function() {

      test('should have an error message if the email is empty', function(assert) {
        // given
        controller.userEmailToAdd = '';

        // when
        controller.addCertificationCenterMembership();

        // then
        assert.equal(controller.errorMessage, 'Ce champ est requis.');
      });

      test('should have an error message if the email syntax is invalid', function(assert) {
        // given
        controller.userEmailToAdd = 'an invalid email';

        // when
        controller.addCertificationCenterMembership();

        // then
        assert.equal(controller.errorMessage, 'L\'adresse e-mail saisie n\'est pas valide.');
      });

      test('should set isLoading to false', function(assert) {
        controller.userEmailToAdd = 'an invalid email';

        // when
        controller.addCertificationCenterMembership();

        // then
        assert.equal(controller.isLoading, false);
      });
    });
  });
});
