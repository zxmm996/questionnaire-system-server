const Koa = require('koa');
const config = require('./config');

const cors = require('koa2-cors');

const bodyParser = require('koa-bodyparser');

const mongoose = require('mongoose');

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
// const course_router = require('./routes/api/course_router');
// const school_router = require('./routes/api/school_router');
// const example_router = require('./routes/api/example_router');

app.use(userRouter.routes()).use(userRouter.allowedMethods());
// app.use(course_router.routes()).use(course_router.allowedMethods());
// app.use(school_router.routes()).use(school_router.allowedMethods());
// app.use(example_router.routes()).use(example_router.allowedMethods());

app.listen(config.port);
