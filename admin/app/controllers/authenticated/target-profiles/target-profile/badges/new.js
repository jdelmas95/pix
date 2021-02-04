import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import { tracked } from '@glimmer/tracking';

export default class NewController extends Controller {
  @service notifications;

  @tracked isSaving = false;

  @action
  goBackToTargetProfileBadges() {
    this.store.deleteRecord(this.model.badge);

    this.transitionToRoute('authenticated.target-profiles.target-profile.badges', this.model.targetProfile.id);
  }

  @action
  async createTargetProfileBadge(event) {
    event.preventDefault();

    try {
      this.isSaving = true;
      await this.model.badge.save();

      this.notifications.success('Le badge a été créé avec succès.');
      this.transitionToRoute('authenticated.target-profiles.target-profile', this.model.targetProfile.id);
    } catch (error) {
      this.notifications.error('Une erreur est survenue.');
    }

    this.isSaving = false;
  }
}
