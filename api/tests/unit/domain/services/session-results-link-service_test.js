
const { expect, sinon } = require('../../../test-helper');
const sessionResultsLinkService = require('../../../../lib/domain/services/session-results-link-service');
const tokenService = require('../../../../lib/domain/services/token-service');

const settings = require('../../../../lib/config');

describe('Unit | Domain | Service | Session Results Link Service', () => {

  describe('#generateResultsLink', () => {

    it('should return a valid download link', () => {
      // given
      const sessionId = 12345;
      const daysBeforeExpiration = 30;

      const tokenServiceStub = sinon.stub(tokenService, 'createCertificationResultsLinkToken');

      const token = 'a_valid_token';

      const expectedLink = `https://app.pix.org/api/sessions/download-all-results/${token}`;
      tokenServiceStub.withArgs({ sessionId, daysBeforeExpiration }).returns(token);

      // when
      const link = sessionResultsLinkService.generateResultsLink(sessionId);

      // then
      expect(link).to.deep.equal(expectedLink);
    });
  });

});
