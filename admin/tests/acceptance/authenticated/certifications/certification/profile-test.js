import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { createAuthenticateSession } from 'pix-admin/tests/helpers/test-init';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | authenticated/certifications/certification/profile', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('When user is not logged in', function() {

    test('it should not be accessible by an unauthenticated user', async function(assert) {
      // given
      const certification = this.server.create('certification');

      // when
      await visit(`/certifications/${certification.id}/profile`);

      // then
      assert.equal(currentURL(), '/login');
    });
  });

  module('When user is logged in', function(hooks) {

    hooks.beforeEach(async () => {
      await createAuthenticateSession({ userId: 1 });
    });

    test('it should display candidates informations', async function(assert) {
      // given
      const certification = this.server.create('certification');

      const area = server.create('area', { id: 'area1', title: 'Area 1' });
      const competence = server.create('competence', { id: 'competence1', name: 'Competence 1', areaId: 'area1' });
      const tube = server.create('tube', { id: 'tube1', practicalTitle: 'Tube 1', competenceId: 'competence1' });
      const skill1 = server.create('skill', { id: 'skill1', name: '@web3', difficulty: 1, tubeId: 'tube1' });
      const skill2 = server.create('skill', { id: 'skill2', name: '@web4', difficulty: 2, tubeId: 'tube1', wasTestedInCertif: true });

      server.create('certification-profile', {
        id: 1,
        candidateFirstName: 'Marc',
        candidateLastName: 'Dupont',
        candidateId: 123,
        certificationCourseId: 7,
        areas: [area],
        competences: [competence],
        tubes: [tube],
        skills: [skill1, skill2],
      });

      // when
      await visit(`/certifications/${certification.id}/profile`);

      // then
      assert.contains('Profile de certification de Marc Dupont');
      assert.contains('UserId du candidat: 123');
      assert.contains(`CertificationCourseId du candidat: ${certification.id}`);
    });

    test('it should display differently skills tested in certification', async function(assert) {
      // given
      const certification = this.server.create('certification');

      const area = server.create('area', { id: 'area1', title: 'Area 1' });
      const competence = server.create('competence', { id: 'competence1', name: 'Competence 1', areaId: 'area1' });
      const tube = server.create('tube', { id: 'tube1', practicalTitle: 'Tube 1', competenceId: 'competence1' });
      const skill1 = server.create('skill', { id: 'skill1', name: '@web3', difficulty: 1, tubeId: 'tube1' });
      const skill2 = server.create('skill', { id: 'skill2', name: '@web4', difficulty: 2, tubeId: 'tube1', wasTestedInCertif: true });

      server.create('certification-profile', {
        id: 1,
        candidateFirstName: 'Marc',
        candidateLastName: 'Dupont',
        areas: [area],
        competences: [competence],
        tubes: [tube],
        skills: [skill1, skill2],
      });

      // when
      await visit(`/certifications/${certification.id}/profile`);

      // then
      assert.dom('svg[data-icon="check"]').exists();
      assert.dom('svg[data-icon="check-double"]').exists();
    });
  });

});
