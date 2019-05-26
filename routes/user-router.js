const Router = require('koa-router');
const router = new Router();
const controller = require('../app/controllers/user-controller');

router.post('/login', controller.login);
router.post('/regist', controller.regist);

module.exports = router;