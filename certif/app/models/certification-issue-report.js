import Model, { attr, belongsTo } from '@ember-data/model';

export const certificationIssueReportCategories = {
  OTHER: 'OTHER',
  CANDIDATE_INFORMATIONS_CHANGES: 'CANDIDATE_INFORMATIONS_CHANGES',
  LATE_OR_LEAVING: 'LATE_OR_LEAVING',
  CONNEXION_OR_END_SCREEN: 'CONNEXION_OR_END_SCREEN',
};

export default class CertificationIssueReport extends Model {
  @attr('string') category;
  @attr('string') description;

  @belongsTo('certification-report') certificationReport;
}