import Model, { attr, hasMany } from '@ember-data/model';

export default class CertificationProfileModel extends Model {
  @attr() candidateId;
  @attr() candidateFirstName;
  @attr() candidateLastName;
  @attr() certificationCourseId;

  @hasMany('skill') skills;
  @hasMany('tube') tubes;
  @hasMany('competence') competences;
  @hasMany('area') areas;
}
