const path                       = require( 'path' );
const nodemailer                 = require( 'nodemailer' );
const hbs                        = require( 'nodemailer-express-handlebars' );
const { host, port, user, pass } = require( '../../Config/mail.json' );

const transport  = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
});

transport.use( 'compile', hbs({
    viewEngine : {
        extName: '.handlebars',
        partialsDir: path.resolve( './src/Services/resources/mail/' ),
        layoutsDir: path.resolve( './src/Services/resources/mail/' ),
        defaultLayout: 'forgot_password',
    },
    viewPath   : path.resolve( './src/Services/resources/mail/' ),
    extName    : '.handlebars',
}));

module.exports = transport;
