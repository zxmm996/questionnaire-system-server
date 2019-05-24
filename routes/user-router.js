const Router = require('koa-router');
const router = new Router();
const controller = require('../app/controllers/user-controller');
// import { login, register} from '../app/controllers/user-controller';
console.log('controller=', controller);
router.post('/login', controller.login);
router.post('/register', controller.register);

module.exports = router;