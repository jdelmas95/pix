import Route from '@ember/routing/route';

export default class TargetProfileNewBadgeRoute extends Route {

  async model() {
    const targetProfile = this.modelFor('authenticated.target-profiles.target-profile');
    const badge = this.store.createRecord('badge');
    return { targetProfile, badge };
  }
}
