const { Serializer } = require('jsonapi-serializer');

module.exports = {

  serialize(finalizedSessions) {
    return new Serializer('publishable-session', {
      attributes: [
        'sessionId',
        'sessionDate',
        'sessionTime',
        'finalizedAt',
        'certificationCenterName',
      ],
    }).serialize(finalizedSessions);

  },
};
