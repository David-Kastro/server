/**
 * Mutation Resolvers.
 */

const { ApolloError } = require( 'apollo-server' );
const bcrypt          = require( 'bcryptjs' );
const crypto          = require( 'crypto' );
const mailer          = require( '../../../../Services/modules/mailer' );
const User            = require( '../../../Models/User' );

const { 
    ServiceError,
    UserNotFound, 
    UserAlreadyExists, 
    InvalidPassword,
    RegistrationError,
    EmailError,
    TokenError,
} = require( '../../../Errors' );

const resolvers = {

    Mutation: {
        async register(_, {name, email, password}) {
        
            if( await User.findOne({ email }) ) {
                throw UserAlreadyExists();
            }
        
            try {
        
                // Creates a New User.
                const new_user = await User.create( {name, email, password} );
                const msg      = 'User Registered with success!';
        
                new_user.password           = undefined;
                new_user.passwordResetUsed  = undefined;
        
                const { id, role }          = new_user

                return { 
                    msg, 
                    token: { id, role }, 
                    user: new_user 
                };
        
            } catch ( err ) {
                throw RegistrationError();
            }
        },

        async login(_, {email, password}) {

            const user    = await User.findOne({ email }).select( '+password' );

            if( !user ) { 
                throw UserNotFound();
            }
            
            // Validates user password.
            if( !await bcrypt.compare( password, user.password ) ) {
                throw InvalidPassword();
            }

            const msg          = 'User authenticated with success! Redirecting...';
            user.password      = undefined;

            const { id, role } = user

            return { 
                msg, 
                token: { id, role }, 
                user 
            };
        },

        async forgotMyPassword(_, { email }) {

            const user    = await User.findOne({ email });

            if( !user ) { 
                throw UserNotFound();
            }

            try {

                // Creates a token with an expiration time of 1 hour.
                const token     = crypto.randomBytes( 20 ).toString( 'hex' );
                const now       = new Date();
                now.setHours( now.getHours() + 1 ); // 1 hour.
        
                // Updates User.
                const update    = await User.findByIdAndUpdate( user.id, {
                    '$set': {
                        passwordResetToken   : token,
                        passwordResetExpires : now,
                        passwordResetUsed    : false,
                    }
                });
        
                // Send an email to the user.
                mailer.sendMail({
        
                    to       : email,
                    from     : 'daviduartedf@gmail.com',  
                    template : 'forgot_password',  // Template for email.
                    context  : { token },
        
                }, err => {
        
                    if( err ) {
                        throw EmailError();
                    }
        
                });
        
                // Unset Password Reset Properties from update.
                update.passwordResetToken   = undefined;
                update.passwordResetExpires = undefined;
                update.passwordResetUsed    = undefined;
                
                const msg = 'New password requested with success. Please, check your Email!';
                return { 
                    msg,
                    user: update, 
                };
        
            } catch ( err ) {
                
                if( err instanceof ApolloError ) {
                    throw err;
                }

                const msg = 'Error while requesting the service "forgot my password". Try again!';
                throw ServiceError( msg );
        
            }
        },  
        
        async resetPassword(_, { email, token, password }) {

            const user          = await User.findOne({ email }).select( '+passwordResetToken +passwordResetExpires +passwordResetUsed' );
            
            if( !user ) { 
                throw UserNotFound();
            }

            try {


                // Checks if sent Token matches user Token
                if( token !== user.passwordResetToken ) {

                    const msg   = 'Token Invalid!'; 
                    throw TokenError( msg );
            
                }

                // Checks if Token has already been used.
                if( user.passwordResetUsed ) {

                    const msg   = 'Token Already Used. Please, request a new password again!'; 
                    throw TokenError( msg );
            
                }

                const now       = new Date();

                // Checks if Token has already expired.
                if( now > user.passwordResetExpires ) {

                    const msg   = 'Token Expired. Please, request a new password again!'; 
                    throw TokenError( msg );
            
                }

                // Set User New Password
                user.password               = password;
                user.passwordResetUsed      = true; // Set Token as used

                // Update User.
                const update                = await user.save();

                // Unset Reset/Password properties from update.
                update.password             = undefined;
                update.passwordResetToken   = undefined;
                update.passwordResetExpires = undefined;
                update.passwordResetUsed    = undefined;
            
                const msg = 'New password created with success!';
                return { 
                    msg,
                    user: update, 
                };

            } catch ( err ) {
                
                if( err instanceof ApolloError ) {
                    throw err;
                }

                const msg = 'Error on requesting the service "reset password". Try again!';
                throw ServiceError( msg );

            }
        },
    }
}

module.exports = {
    resolvers
}