const Koa = require('koa');
const config = require('./config');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const app = new Koa();

mongoose.connect(config.db, {useNewUrlParser:true}, (err) => {
    if (err) {
        console.error('Failed to connect to database');
    } else {
        console.log('Connecting database successfully');
    }
});

app.use(cors());

app.use(bodyParser());

const userRouter = require('./routes/user-router');
const formRouter = require('./routes/form-router');

app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(formRouter.routes()).use(formRouter.allowedMethods());

app.listen(config.port);
