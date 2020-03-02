/**
 * Query Resolvers.
 */

const User = require('../../../Models/User');

const { UserNotFound } = require('../../../Errors');

const resolvers = {
  Query: {
    async getCurrentUser(_, __, { loggedUser }) {
      const user = await User.findById(loggedUser.id);

      return user;
    },

    async getUser(_, { id }) {
      const user = await User.findById(id);

      if (!user) {
        throw UserNotFound();
      }

      return user;
    },

    async getUserByEmail(_, { email }) {
      const user = await User.findOne({ email });

      if (!user) {
        throw UserNotFound();
      }

      return user;
    },

    async getUsersByName(_, { name }) {
      const users = await User.find({ name: new RegExp(`^${name}$`, 'i') });

      return users;
    },

    async getUsers() {
      const users = await User.find();

      return users;
    }
  }
};

module.exports = {
  resolvers
};
