const { expect, sinon, HttpTestServer } = require('../../../test-helper');

const studentUserAssociationController = require('../../../../lib/application/student-dependent-users/student-dependent-user-controller');
const moduleUnderTest = require('../../../../lib/application/student-dependent-users');
const securityController = require('../../../../lib/interfaces/controllers/security-controller');

describe('Integration | Application | Route | student-dependent-users', () => {

  let httpTestServer;

  beforeEach(() => {
    sinon.stub(securityController, 'checkUserBelongsToScoOrganizationAndManagesStudents').callsFake((request, h) => h.response(true));
    sinon.stub(studentUserAssociationController, 'createAndAssociateUserToStudent').callsFake((request, h) => h.response('ok').code(201));
    sinon.stub(studentUserAssociationController, 'updatePassword').callsFake((request, h) => h.response('ok').code(200));
    httpTestServer = new HttpTestServer(moduleUnderTest);
  });

  describe('POST /api/student-dependent-users', () => {

    it('should succeed', async () => {
      // given
      const method = 'POST';
      const url = '/api/student-dependent-users';
      const payload = {
        data: {
          attributes: {
            'campaign-code': 'RESTRICD',
            'first-name': 'Robert',
            'last-name': 'Smith',
            birthdate: '2012-12-12',
            username: 'robert.smith1212',
            password: 'P@ssw0rd'
          }
        }
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(201);
    });
  });

  describe('POST /api/student-dependent-users/password-update', () => {

    it('should succeed', async () => {
      // given
      const method = 'POST';
      const url = '/api/student-dependent-users/password-update';
      const payload = {
        data: {
          attributes: {
            'student-id': 1,
            'organization-id': 3,
            'password': 'P@ssw0rd'
          }
        }
      };

      // when
      const response = await httpTestServer.request(method, url, payload);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

});