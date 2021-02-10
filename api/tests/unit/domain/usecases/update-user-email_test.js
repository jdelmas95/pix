const bcrypt = require('bcrypt');

const updateUserEmail = require('../../../../lib/domain/usecases/update-user-email');
const { AlreadyRegisteredEmailError, UserNotAuthorizedToUpdateEmailError } = require('../../../../lib/domain/errors');

const { sinon, expect, catchErr } = require('../../../test-helper');

describe('Unit | UseCase | update-user-email', () => {

  let userRepository;
  let schoolingRegistrationRepository;

  const password = 'password123';
  // eslint-disable-next-line no-sync
  const passwordHash = bcrypt.hashSync(password, 1);

  beforeEach(() => {
    userRepository = {
      updateEmail: sinon.stub(),
      isEmailAvailable: sinon.stub(),
      get: sinon.stub().resolves({ email: 'old_email@example.net' }),
      getByUsernameOrEmailWithRolesAndPassword: sinon.stub().resolves({ authenticationMethods: [ { authenticationComplement: { password: passwordHash } }] }),
    };

    schoolingRegistrationRepository = {
      findByUserId: sinon.stub().resolves([]),
    };
  });

  it('should call updateEmail', async () => {
    // given
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'new_email@example.net';

    // when
    await updateUserEmail({
      userId,
      authenticatedUserId,
      email: newEmail,
      password,
      userRepository,
      schoolingRegistrationRepository,
    });

    // then
    expect(userRepository.updateEmail).to.have.been.calledWith({
      id: userId,
      email: newEmail,
    });
  });

  it('should save email in lower case', async () => {
    // given
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'EMAIl_IN_UPPER_CASE@example.net';
    const newEmailInLowerCase = newEmail.toLowerCase();

    // when
    await updateUserEmail({
      userId,
      authenticatedUserId,
      email: newEmail,
      password,
      userRepository,
      schoolingRegistrationRepository,
    });

    // then
    expect(userRepository.updateEmail).to.have.been.calledWith({
      id: userId,
      email: newEmailInLowerCase,
    });
  });

  it('throw AlreadyRegisteredEmailError if email already exists', async () => {
    // given
    userRepository.isEmailAvailable.rejects(new AlreadyRegisteredEmailError());
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'new_email@example.net';

    // when
    const error = await catchErr(updateUserEmail)({
      userId,
      authenticatedUserId,
      email: newEmail,
      password,
      userRepository,
      schoolingRegistrationRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(AlreadyRegisteredEmailError);
  });

  it('throw UserNotAuthorizedToUpdateEmailError if the authenticated user try to change the email of an other user', async () => {
    // given
    const userId = 1;
    const authenticatedUserId = 2;
    const newEmail = 'new_email@example.net';

    // when
    const error = await catchErr(updateUserEmail)({
      userId,
      authenticatedUserId,
      email: newEmail,
      userRepository,
      schoolingRegistrationRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotAuthorizedToUpdateEmailError);
  });

  it('throw UserNotAuthorizedToUpdateEmailError if user has not email', async () => {
    // given
    userRepository.get.resolves({});
    const userId = 1;
    const authenticatedUserId = 1;
    const newEmail = 'new_email@example.net';

    // when
    const error = await catchErr(updateUserEmail)({
      userId,
      authenticatedUserId,
      email: newEmail,
      userRepository,
      schoolingRegistrationRepository,
    });

    // then
    expect(error).to.be.an.instanceOf(UserNotAuthorizedToUpdateEmailError);
  });
});
