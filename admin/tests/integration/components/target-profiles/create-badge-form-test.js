import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, triggerEvent, render } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | TargetProfiles::CreateBadgeForm', function(hooks) {
  setupRenderingTest(hooks);

  let onSubmit;
  let onCancel;

  hooks.beforeEach(function() {
    onSubmit = sinon.stub();
    onCancel = sinon.stub();

    this.set('onSubmit', onSubmit);
    this.set('onCancel', onCancel);
  });

  test('it should display the fields', async function(assert) {
    // when
    await render(hbs`<TargetProfiles::CreateBadgeForm
                         @onSubmit={{this.onSubmit}}
                         @onCancel={{this.onCancel}} />`);

    // then
    assert.contains('Nom * :');
    assert.contains('Key * :');
    assert.contains('Message * :');
    assert.contains('Lien de l\'image :');
    assert.contains('Texte alternatif à l\'image :');
    assert.contains('Annuler');
    assert.contains('Enregistrer');
    assert.dom('button[type=submit]').isNotDisabled();
  });

  test('it shoud disable the submit button when isDisabled is true', async function(assert) {
    // given
    this.set('isDisabled', true);

    // when
    await render(hbs`<TargetProfiles::CreateBadgeForm
                         @isDisabled={{this.isDisabled}}
                         @onSubmit={{this.onSubmit}}
                         @onCancel={{this.onCancel}}/>`);

    // then
    assert.dom('button[type=submit]').isDisabled();
  });

  test('it should call onCancel when form is canceled', async function(assert) {
    // when
    await render(hbs`<TargetProfiles::CreateBadgeForm
                         @onSubmit={{this.onSubmit}}
                         @onCancel={{this.onCancel}}/>`);

    await click('button[type="button"]');

    // then
    assert.ok(onCancel.called);
  });

  test('it should call onSubmit when form is submited', async function(assert) {
    // when
    await render(hbs`<TargetProfiles::CreateBadgeForm
                         @onSubmit={{this.onSubmit}}
                         @onCancel={{this.onCancel}}/>`);

    await triggerEvent(
      'form',
      'submit',
    );

    // then
    assert.ok(onSubmit.called);
  });
});
