/**
 * Schema Loader.
 */

const fs        = require( 'fs' );
const path      = require( 'path' );

// Get the folders of a directory
const getFoldersInDirectory = directory => {
    
    return fs
        .readdirSync( directory )
        .filter( content => directoryIsFolder( path.resolve( directory, content ) ) );

}

// Get the resolvers of a directory
const getResolversInDirectory = directory => {

    return fs
        .readdirSync( directory )
        .filter( content   => directoryIsFolder( path.resolve( directory, content ) ) )
        .map( resolverType => require( path.resolve( directory, resolverType, 'resolvers.js' ) ).resolvers )
        
        .reduce( ( allResolversInDirectory, currentResolvers ) => {

            for( let i in currentResolvers ) {
                allResolversInDirectory[i] = {...allResolversInDirectory[i], ...currentResolvers[i]};
            }

            return allResolversInDirectory;
        });
}

// Checks if directory is a folder.
const directoryIsFolder = directory => {
    
    return fs
        .lstatSync( directory )
        .isDirectory();

}

const typeDefs  = getFoldersInDirectory( __dirname )
    .map( folder => {

        const schema_path = path.resolve( __dirname, folder, 'Schema.js' );

        if ( fs.existsSync( schema_path ) ) {

            return require( schema_path ).typeDefs;

        }
    })

const resolvers = getFoldersInDirectory( __dirname )
    .filter( folder => fs.existsSync( path.resolve( __dirname, folder, 'Resolvers' ) ) )
    .map( filteredFolder => getResolversInDirectory( path.resolve( __dirname, filteredFolder, 'Resolvers' ) ) )
    .reduce( (allResolvers, allResolversInDirectory) => {

        for( let i in allResolversInDirectory ) {
            allResolvers[i] = {...allResolvers[i], ...allResolversInDirectory[i]};
        }

        return allResolvers;
    });

module.exports = {
    typeDefs,
    resolvers,
}