import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import isEmailValid from '../utils/email-validator';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const STATUS_MAP = {
  defaultStatus: 'default',
  errorStatus: 'error',
  successStatus: 'success',
};

const ERROR_INPUT_MESSAGE_MAP = {
  wrongFormat: 'pages.user-account.account-update-email.fields.errors.wrong-format',
  mismatching: 'pages.user-account.account-update-email.fields.errors.mismatching',
  empty: 'pages.user-account.account-update-email.fields.errors.empty',
  unknown: 'pages.user-account.account-update-email.fields.errors.unknown',
  invalidPassword: 'pages.user-account.account-update-email.fields.errors.invalid-password',
};

class NewEmailValidation {
  @tracked status = STATUS_MAP['defaultStatus'];
  @tracked message = null;
}

class NewEmailConfirmationValidation {
  @tracked status = STATUS_MAP['defaultStatus'];
  @tracked message = null;
}

class PasswordValidation {
  @tracked status = STATUS_MAP['defaultStatus'];
  @tracked message = null;
}

export default class UserAccountUpdateEmail extends Component {

  @service intl;
  @tracked newEmail = '';
  @tracked newEmailConfirmation = '';
  @tracked password = '';
  @tracked errorMessage = null;

  @tracked newEmailValidation = new NewEmailValidation();
  @tracked newEmailConfirmationValidation = new NewEmailConfirmationValidation();
  @tracked passwordValidation = new PasswordValidation();

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
  validatePassword() {

    const isInvalidInput = isEmpty(this.password);

    if (isInvalidInput) {
      this.passwordValidation.status = STATUS_MAP['errorStatus'];
      this.passwordValidation.message = this.intl.t(ERROR_INPUT_MESSAGE_MAP['empty']);
    }
  }

  @action
  async saveNewEmail(event) {
    event && event.preventDefault();
    this.errorMessage = null;

    if (this.newEmail === this.newEmailConfirmation && isEmailValid(this.newEmail) && !isEmpty(this.password)) {
      this.args.user.email = this.newEmail.trim().toLowerCase();
      this.args.user.password = this.password;
      try {
        await this.args.user.save({ adapterOptions: { updateEmail: true } });
        this.args.disableEmailEditionMode();
      } catch (response) {
        const status = get(response, 'errors[0].status');
        if (status === '422') {
          this.errorMessage = this.intl.t(ERROR_INPUT_MESSAGE_MAP['wrongFormat']);
        } else if (status === '400' || status === '403') {
          this.errorMessage = get(response, 'errors[0].detail');
        } else if (status === '401') {
          this.errorMessage = this.intl.t(ERROR_INPUT_MESSAGE_MAP['invalidPassword']);
        } else {
          this.errorMessage = this.intl.t(ERROR_INPUT_MESSAGE_MAP['unknown']);
        }
      }
    }
  }
}
