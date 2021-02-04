import Route from '@ember/routing/route';

export default class AssessmentsIndexRoute extends Route {

  beforeModel() {
    return this.replaceWith('assessments.resume');
  }

}
