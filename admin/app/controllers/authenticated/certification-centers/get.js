import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import isEmailValid from '../../../utils/email-validator';

export default class AuthenticatedCertificationCentersGetController extends Controller {

  @service notifications;

  @tracked isLoading = false;
  @tracked userEmailToAdd;
  @tracked errorMessage;

  @action
  async addCertificationCenterMembership() {
    const { certificationCenter } = this.model;
    const email = this.userEmailToAdd.trim();

    this.errorMessage = null;
    if (!email) {
      this.errorMessage = 'Ce champ est requis.';
    } else if (!isEmailValid(email)) {
      this.errorMessage = 'L\'adresse e-mail saisie n\'est pas valide.';
    } else {
      try {
        this.isLoading = true;
        await this.store.createRecord('certification-center-membership')
          .save({
            adapterOptions: {
              certificationCenterId: certificationCenter.id,
              email,
            },
          });

        await this.model.certificationCenterMemberships.reload();

        this.userEmailToAdd = null;
        this.notifications.success('Membre ajouté avec succès.');
      } catch (e) {
        this.notifications.error('Une erreur est survenue.');
      } finally {
        this.isLoading = false;
      }
    }
  }

}
