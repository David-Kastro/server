const { ApolloError } = require('apollo-server');

module.exports = {
  ServiceError: (
    msg = 'Error while requesting the service!',
    code = 'SERVICE_ERROR',
    data = { type: 'error' }
  ) => new ApolloError(msg, code, data),

  UserNotFound: (
    msg = 'User Not Found!',
    code = 'USER_NOT_FOUND',
    data = { type: 'error' }
  ) => new ApolloError(msg, code, data),

  UserAlreadyExists: (
    msg = 'User already exists!',
    code = 'USER_ALREADY_EXISTS',
    data = { type: 'info' }
  ) => new ApolloError(msg, code, data),

  InvalidPassword: (
    msg = 'Invalid Password!',
    code = 'INVALID_PASSWORD',
    data = { type: 'info' }
  ) => new ApolloError(msg, code, data),

  RegistrationError: (
    msg = 'Registration failed!',
    code = 'REGISTRATION_FAILED',
    data = { type: 'error' }
  ) => new ApolloError(msg, code, data),

  AuthenticationError: (
    msg = 'You must be logged in!',
    code = 'UNAUTHENTICATED',
    data = { type: 'error' }
  ) => new ApolloError(msg, code, data),

  AuthorizationError: (
    msg = 'You dont have access to this service!',
    code = 'UNAUTHORIZED',
    data = { type: 'error' }
  ) => new ApolloError(msg, code, data),

  EmailError: (
    msg = 'Error while sending an Email!',
    code = 'EMAIL_ERROR',
    data = { type: 'error' }
  ) => new ApolloError(msg, code, data),

  TokenError: (
    msg = 'Token Invalid!',
    code = 'TOKEN_ERROR',
    data = { type: 'error' }
  ) => new ApolloError(msg, code, data)
};
