const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./App/Schemas');
const { AuthDirective } = require('./App/Directives/Authentication');
const { TokenDirective } = require('./App/Directives/Token');

// Middlewares
const TokenValidation = require('./App/Middlewares/TokenValidation');

const server = new ApolloServer({
  typeDefs,
  resolvers,

  schemaDirectives: {
    auth: AuthDirective,
    createToken: TokenDirective
  },

  context: ({ req }) => {
    const token = req.headers.authorization || null;
    const loggedUser = TokenValidation(token);

    return { loggedUser };
  }
});

server
  .listen()
  .then(({ url }) => console.log(`Apollo server listening on ${url}`));
