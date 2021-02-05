import Route from '@ember/routing/route';

export default class AuthenticatedSessionsListToBePublishedRoute extends Route {
  async model() {
    try {
      return this.store.findAll('publishable-session');
    } catch (error) {
      return [];
    }
  }
}
