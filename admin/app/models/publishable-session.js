import Model, { attr } from '@ember-data/model';

export default class PublishableSessionModel extends Model {
  @attr() certificationCenterName;
  @attr() sessionDate;
  @attr() sessionTime;
  @attr() finalizedAt;

  get sessionDateAndTime() {
    return (new Date(this.sessionDate)).toLocaleDateString('fr-FR') + ' à ' + this.sessionTime;
  }

  get finalizationDate() {
    return (new Date(this.finalizedAt)).toLocaleDateString();
  }
}
