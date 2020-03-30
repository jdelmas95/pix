const CampaignParticipationResult = require('../../domain/models/CampaignParticipationResult');
const campaignParticipationRepository = require('./campaign-participation-repository');
const targetProfileRepository = require('./target-profile-repository');
const competenceRepository = require('./competence-repository');
const assessmentRepository = require('./assessment-repository');
const knowledgeElementRepository = require('./knowledge-element-repository');

const campaignParticipationResultRepository = {
  async getByParticipationId(campaignParticipationId) {
    const campaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

    const [targetProfile, competences, assessment, knowledgeElements] = await Promise.all([
      targetProfileRepository.getByCampaignId(campaignParticipation.campaignId),
      competenceRepository.list(),
      assessmentRepository.get(campaignParticipation.assessmentId),
      knowledgeElementRepository.findUniqByUserId({
        userId: campaignParticipation.userId,
        limitDate: campaignParticipation.sharedAt
      }),
    ]);

    const campaignParticipationResult = CampaignParticipationResult.buildFrom({
      campaignParticipationId,
      assessment,
      competences,
      targetProfile,
      knowledgeElements,
      badge: null
    });
    return campaignParticipationResult;
  }
};

module.exports = campaignParticipationResultRepository;