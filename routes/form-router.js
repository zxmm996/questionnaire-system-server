const Router = require('koa-router');
const router = new Router();
const controller = require('../app/controllers/form-controller');

router.post('/form', controller.createForm);
router.get('/forms', controller.getForms);
router.delete('/form', controller.deleteForm);
router.get('/form', controller.getFormDetail);
router.post('/fill', controller.fillForm);
router.post('/export', controller.exportForm);

module.exports = router;