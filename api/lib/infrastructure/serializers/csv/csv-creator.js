const _ = require('lodash');
const csvSerializer = require('./csv-serializer');

class CsvCreator {
  constructor(stream) {
    this.stream = stream;
  }

  createHeaderOfCSV(skills, competences, idPixLabel, organizationType, organizationIsManagingStudents) {
    const areas = this.extractAreas(competences);

    const headers = [
      'Nom de l\'organisation',
      'ID Campagne',
      'Nom de la campagne',
      'Nom du Profil Cible',
      'Nom du Participant',
      'Prénom du Participant',
      ...((organizationType === 'SUP' && organizationIsManagingStudents) ? ['Numéro Étudiant'] : []),

      ...(idPixLabel ? [idPixLabel] : []),

      '% de progression',
      'Date de début',
      'Partage (O/N)',
      'Date du partage',
      '% maitrise de l\'ensemble des acquis du profil',

      ...(_.flatMap(competences, (competence) => [
        `% de maitrise des acquis de la compétence ${competence.name}`,
        `Nombre d'acquis du profil cible dans la compétence ${competence.name}`,
        `Acquis maitrisés dans la compétence ${competence.name}`,
      ])),

      ...(_.flatMap(areas, (area) => [
        `% de maitrise des acquis du domaine ${area.title}`,
        `Nombre d'acquis du profil cible du domaine ${area.title}`,
        `Acquis maitrisés du domaine ${area.title}`,
      ])),

      ...(_.map(skills, 'name')),
    ];

    const headerLine = '\uFEFF' + csvSerializer.serializeLine(headers);
    this.stream.write(headerLine);
  }

  extractAreas(competences) {
    return _.uniqBy(competences.map((competence) => competence.area), 'code');
  }

  async createLine(knowledgeElementRepository, campaignParticipationInfo, campaignCsvExportService, organization, campaign, competences, targetProfile, writableStream) {
    const participantKnowledgeElements = await knowledgeElementRepository.findUniqByUserId({
      userId: campaignParticipationInfo.userId,
      limitDate: campaignParticipationInfo.sharedAt,
    });

    const csvLine = campaignCsvExportService.createOneCsvLine({
      organization,
      campaign,
      competences,
      campaignParticipationInfo,
      targetProfile,
      participantKnowledgeElements,
    });

    writableStream.write(csvLine);
  }
}

module.exports = CsvCreator;