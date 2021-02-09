const _ = require('lodash');

class CampaignParticipationOverview {

  constructor({
    id,
    createdAt,
    isShared,
    sharedAt,
    targetProfileId,
    validatedSkillsCount,
    totalSkillsCount,
    organizationName,
    assessmentState,
    campaignCode,
    campaignTitle,
    campaignArchivedAt,
    targetProfile,
  } = {}) {
    this.id = id;
    this.createdAt = createdAt;
    this.isShared = isShared;
    this.sharedAt = sharedAt;
    this.targetProfileId = targetProfileId;
    this.validatedSkillsCount = validatedSkillsCount;
    this.totalSkillsCount = totalSkillsCount;
    this.organizationName = organizationName;
    this.assessmentState = assessmentState;
    this.campaignCode = campaignCode;
    this.campaignTitle = campaignTitle;
    this.campaignArchivedAt = campaignArchivedAt;
    this.targetProfile = targetProfile;
  }

  get masteryPercentage() {
    if (_.isNil(this.totalSkillsCount) || !this.isShared) return null;

    if (this.totalSkillsCount === 0) return 0;

    return Math.round(this.validatedSkillsCount * 100 / this.totalSkillsCount);
  }

  get validatedStages() {
    const validatedStages = this.targetProfile.stages.filter((stage) => stage.threshold <= this.validatedSkillsCount);
    return validatedStages.length;
  }

  get totalStagesCount() {
    return this.targetProfile.stages.length;
  }
}

module.exports = CampaignParticipationOverview;
