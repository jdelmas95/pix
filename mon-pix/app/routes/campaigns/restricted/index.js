import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CampaignsRestrictedIndexRoute extends Route {
  @service session;

  beforeModel() {
    if (this.session.isAuthenticated) {
      return this.replaceWith('campaigns.restricted.join');
    }
    return this.replaceWith('campaigns.restricted.login-or-register-to-access');
  }

}
