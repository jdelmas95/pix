import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import isEmailValid from '../utils/email-validator';

const STATUS_MAP = {
  defaultStatus: 'default',
  errorStatus: 'error',
  successStatus: 'success',
};

const ERROR_INPUT_MESSAGE_MAP = {
  wrongFormat: 'pages.user-account.account-update-email.fields.errors.wrong-format',
  mismatching: 'pages.user-account.account-update-email.fields.errors.mismatching',
};

class NewEmailValidation {
  @tracked status = STATUS_MAP['defaultStatus'];
  @tracked message = null;
}

class NewEmailConfirmationValidation {
  @tracked status = STATUS_MAP['defaultStatus'];
  @tracked message = null;
}

export default class UserAccountUpdateEmail extends Component {

  @service intl;
  @tracked newEmail = '';
  @tracked newEmailConfirmation = '';

  @tracked newEmailValidation = new NewEmailValidation();
  @tracked newEmailConfirmationValidation = new NewEmailConfirmationValidation();

  @action
  validateNewEmail() {
    const isInvalidInput = !isEmailValid(this.newEmail);

    this.newEmailValidation.status = STATUS_MAP['successStatus'];
    this.newEmailValidation.message = null;

    if (isInvalidInput) {
      this.newEmailValidation.status = STATUS_MAP['errorStatus'];
      this.newEmailValidation.message = this.intl.t(ERROR_INPUT_MESSAGE_MAP['wrongFormat']);
    }
  }

  @action
  validateNewEmailConfirmation() {
    const isInvalidInput = !isEmailValid(this.newEmailConfirmation);

    this.newEmailConfirmationValidation.status = STATUS_MAP['successStatus'];
    this.newEmailConfirmationValidation.message = null;

    if (isInvalidInput) {
      this.newEmailConfirmationValidation.status = STATUS_MAP['errorStatus'];
      this.newEmailConfirmationValidation.message = this.intl.t(ERROR_INPUT_MESSAGE_MAP['wrongFormat']);
    } else if (this.newEmail !== this.newEmailConfirmation) {
      this.newEmailConfirmationValidation.status = STATUS_MAP['errorStatus'];
      this.newEmailConfirmationValidation.message = this.intl.t(ERROR_INPUT_MESSAGE_MAP['mismatching']);
    }
  }

  @action
  async saveNewEmail(event) {
    event && event.preventDefault();

    if (this.newEmail === this.newEmailConfirmation && isEmailValid(this.newEmail)) {
      this.args.user.email = this.newEmail.trim().toLowerCase();
      try {
        await this.args.user.save({ adapterOptions: { updateEmail: true } });
        this.args.disableEmailEditionMode();
      } catch (error) {
        return error;
      }
    }
  }
}
