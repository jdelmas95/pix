const { UserNotAuthorizedToAccessEntity } = require('../errors');

module.exports = async function getCampaignParticipationResult({
  userId,
  locale,
  campaignParticipationId,
  badgeRepository,
  badgeAcquisitionRepository,
  campaignParticipationRepository,
  campaignParticipationResultRepository,
  targetProfileRepository,
}) {
  const campaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);
  if (userId !== campaignParticipation.userId) {
    throw new UserNotAuthorizedToAccessEntity('User does not have access to this campaign participation');
  }

  const targetProfile = await targetProfileRepository.getByCampaignId(campaignParticipation.campaignId);
  const campaignBadges = await badgeRepository.findByTargetProfileId(targetProfile.id);
  const campaignBadgeIds = campaignBadges.map((badge) => badge.id);

  const acquiredBadgeIds = await badgeAcquisitionRepository.getAcquiredBadgeIds({ userId, badgeIds: campaignBadgeIds });

  return campaignParticipationResultRepository.getByParticipationId(campaignParticipationId, campaignBadges, acquiredBadgeIds, locale);
};
