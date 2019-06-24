const mongoose   = require( '../../DataBase' );
const bcrypt     = require( 'bcryptjs' );

//Data Model for User
const UserSchema = new mongoose.Schema({
    name          : {
        type      : String,
        required  : true,
    },
    email         : {
        type      : String,
        unique    : true,
        required  : true,
        lowercase : true,
    },
    password      : {
        type      : String,
        required  : true,
        select    : false,
    },
    role          : {
        type      : String,
        required  : true,
        uppercase : true,
        default   : 'USER',
    },
    passwordResetToken : {
        type      : String,
        select    : false,
    },
    passwordResetExpires : {
        type      : Date,
        select    : false,
    },
    passwordResetUsed : {
        type      : Boolean,
        select    : false,
        default   : false,
    },
    createAt      : {
        type      : Date,
        default   : Date.now,
    },
});

UserSchema.pre( 'save', async function( next ) {
    const hash    = await bcrypt.hash( this.password, 10 );
    this.password = hash;

    next();
});

const User        = mongoose.model( 'User', UserSchema );

module.exports    = User;