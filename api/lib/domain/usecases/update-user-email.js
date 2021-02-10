const authenticationService = require('../../domain/services/authentication-service');
const { UserNotAuthorizedToUpdateEmailError } = require('../errors');

module.exports = async function updateUserEmail({
  email,
  userId,
  authenticatedUserId,
  password,
  userRepository,
}) {
  if (userId !== authenticatedUserId) {
    throw new UserNotAuthorizedToUpdateEmailError();
  }

  const user = await userRepository.get(userId);
  if (!user.email) {
    throw new UserNotAuthorizedToUpdateEmailError();
  }

  await authenticationService.getUserByUsernameAndPassword({
    username: user.email,
    password,
    userRepository,
  });

  await userRepository.isEmailAvailable(email);
  await userRepository.updateEmail({ id: userId, email: email.toLowerCase() });
};
