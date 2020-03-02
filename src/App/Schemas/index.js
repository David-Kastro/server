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

// Checks if directory is a folder.
const directoryIsFolder = directoryPath => {
    
    return fs
        .lstatSync( directoryPath )
        .isDirectory();

}

// Get the resolvers of a directory
const getResolversInDirectory = directory => {

    const allResolvers = fs
        .readdirSync( directory )
        .filter( file  => file.endsWith('Resolvers.js') )
        .map( resolver => require( path.resolve( directory, resolver ) ).resolvers );
    
    if( !allResolvers.length ) {
        return {}
    }

    return allResolvers
        .reduce( ( allResolversInDirectory, currentResolvers ) => {

            for( let i in currentResolvers ) {
                allResolversInDirectory[i] = {...allResolversInDirectory[i], ...currentResolvers[i]};
            }

            return allResolversInDirectory;
        });
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