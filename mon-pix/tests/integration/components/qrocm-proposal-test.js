import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | QROCm proposal', function() {

  setupRenderingTest();

  it('renders', async function() {
    await render(hbs`{{qrocm-proposal}}`);

    expect(find('.qrocm-proposal')).to.exist;
  });

  describe('When format is a paragraph', function() {
    it('should display a textarea', async function() {
      // given
      this.set('proposals', '${myInput}');
      this.set('format', 'paragraphe');

      // when
      await render(hbs`{{qrocm-proposal proposals=proposals format=format}}`);

      // then
      expect(find('.challenge-response__proposal--textarea').tagName).to.equal('TEXTAREA');
    });
  });

  describe('When format is a not paragraph', function() {
    [
      { format: 'petit', expectedSize: '10' },
      { format: 'mots', expectedSize: '20' },
      { format: 'phrase', expectedSize: '50' },
      { format: 'unreferenced_format', expectedSize: '20' }
    ].forEach((data) => {
      it(`should display an input with expected size (${data.expectedSize}) when format is ${data.format}`, async function() {
        // given
        this.set('proposals', '${myInput}');
        this.set('format', data.format);

        // when
        await render(hbs`{{qrocm-proposal proposals=proposals format=format}}`);

        // then
        expect(find('.challenge-response__proposal--textarea')).to.not.exist;
        expect(find('.challenge-response__proposal').tagName).to.equal('INPUT');
        expect(find('.challenge-response__proposal').getAttribute('size')).to.equal(data.expectedSize);
      });
    });
  });

  describe('Whatever the format', function() {
    [
      { format: 'mots', cssClass: '.challenge-response__proposal', inputType: 'input' },
      { format: 'unreferenced_format', cssClass: '.challenge-response__proposal', inputType: 'input' },
      { format: 'paragraphe', cssClass: '.challenge-response__proposal--textarea', inputType: 'textarea' },
    ].forEach((data) => {
      describe(`Component behavior when the user clicks on the ${data.inputType}`, function() {

        it('should not display autocompletion answers', async function() {
          // given
          const proposals = '${myInput}';
          this.set('proposals', proposals);
          this.set('answerValue', '');
          this.set('format', `${data.format}`);

          // when
          await render(hbs`{{qrocm-proposal proposals=proposals format=format answerValue=answerValue}}`);

          // then
          expect(find(`${data.cssClass}`).getAttribute('autocomplete')).to.equal('off');
        });
      });
    });
  });
});
