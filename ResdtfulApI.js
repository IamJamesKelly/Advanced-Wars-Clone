var express = require('express'),
playerDb = require('./PlayerDataBase');
var app = express();
 
app.configure(function () 
{
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/PlayerDataBase/:signIn', playerDb.signIn);
app.post('/PlayerDataBase', playerDb.insertPlayer);
app.put('/PlayerDataBase/:id',playerDb.updatePlayer);
app.listen(3000);