import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import isEmailValid from '../../../utils/email-validator';
import { tracked } from '@glimmer/tracking';

export default class AuthenticatedCertificationCentersGetController extends Controller {

  @service notifications;

  @tracked isLoading = false;
  @tracked userEmailToAdd;
  @tracked errorMessage;

  @action
  async addCertificationCenterMembership() {
    this.isLoading = true;

    const { certificationCenter } = this.model;
    const email = this.userEmailToAdd.trim();

    if (!this._isEmailValid(email)) {
      this.isLoading = false;
      return;
    }

    try {
      await this.store.createRecord('certification-center-membership', {
        certificationCenter,
        user: { email },
      }).save();

      this.userEmailToAdd = null;
      this.notifications.success('Accès attribué avec succès.');
    } catch (e) {
      this.notifications.error('Une erreur est survenue.');
    } finally {
      this.isLoading = false;
    }
  }

  _isEmailValid(email) {
    if (!email) {
      this.errorMessage = 'Ce champ est requis.';
      return false;
    }

    if (!isEmailValid(email)) {
      this.errorMessage = 'L\'adresse e-mail saisie n\'est pas valide.';
      return false;
    }

    this.errorMessage = null;
    return true;
  }
}
