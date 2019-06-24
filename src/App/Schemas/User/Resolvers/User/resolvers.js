/**
 * User Resolvers
 */

const resolvers = {

    User: {
        createAt({ createAt }) {
            const date = new Date( createAt );
            
            return date
                .toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, '');
        }
    }
}

module.exports = {
    resolvers
}