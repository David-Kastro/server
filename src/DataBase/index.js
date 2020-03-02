const mongoose   = require( 'mongoose' );

mongoose.connect( 'mongodb://localhost/restserver', { 
    useNewUrlParser  : true,
    useCreateIndex   : true,
    useFindAndModify : false,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

module.exports   = mongoose;