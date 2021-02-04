import Route from '@ember/routing/route';

export default class CompetencesIndexRoute extends Route {

  beforeModel() {
    return this.replaceWith('competences.details');
  }

}
