import Route from '@ember/routing/route';

export default class AuthenticatedCertificationsCertificationProfileRoute extends Route {

  model() {
    const certificationCourseId = this.modelFor('authenticated.certifications.certification').id;
    // todo : get certification-profile from api
    return certificationCourseId;
  }
}
