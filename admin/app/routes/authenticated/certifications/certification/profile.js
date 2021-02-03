import Route from '@ember/routing/route';

export default class AuthenticatedCertificationsCertificationProfileRoute extends Route {

  model() {
    const certificationCourseId = this.modelFor('authenticated.certifications.certification').id;

    // todo : replace this with true data from api
    const area1 = this.store.createRecord('area', { id: '1', title: 'Cirque', color: 'jaffa' });
    const competence1 = this.store.createRecord('competence', { id: '2', name: 'Jongler', areaId: '1' });
    const tube1 = this.store.createRecord('tube', { id: '3', practicalTitle: 'Jongler avec des bananes', competenceId: '2' });
    const skill1 = this.store.createRecord('skill', { id: '4', name: '1 banane', tubeId: '3', difficulty: 1, wasTestedInCertif: false });
    const skill2 = this.store.createRecord('skill', { id: '5', name: '2 banane', tubeId: '3', difficulty: 2, wasTestedInCertif: true });

    const certificationProfile = this.store.createRecord('certification-profile', {
      candidateId: 123,
      candidateFirstName: 'Marc',
      candidateLastName: 'Dupont',
      certificationCourseId,
      skills: [skill1, skill2],
      tubes: [tube1],
      competences: [competence1],
      areas: [area1],
    });

    return certificationProfile;
  }
}
