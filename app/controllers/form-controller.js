const config = require('./../../config');
const Form_col = require('./../models/form');
const uuidv1 = require('uuid/v1');

// 创建
const createForm = async (ctx, next) => {
  const req = ctx.request.body;
  ctx.status = 200;
  
  // 插入新表单
  const formId = uuidv1();
  const newForm = await Form_col.create({
    formId,
    userId: req.userId,
    title: req.title,
    questions: req.questions,
    answers: [],
  });

  if (newForm) {
    ctx.body = {
      code: 1,
      msg: '新增成功！',
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '新增失败！'
    };
  }
}

// 获取用户创建的表单
const getForms = async (ctx, next) => {
  const req = ctx.request.query;
  ctx.status = 200;
  
  const formList = await Form_col.find({
    userId: req.userId,
  }, {
    formId: 1,
    title: 1,
    _id: 0,
  });


  ctx.body = {
    code: 1,
    data: formList || [],
  }
}

// 获取单个表单详情
const getFormDetail = async (ctx, next) => {
  const req = ctx.request.query;
  ctx.status = 200;
  
  const result = await Form_col.findOne({
    formId: req.formId,
  }, {
    _id: 0,
  });

  if (result) {
    ctx.body = {
      code: 1,
      data: result || [],
    }
  } else {
    ctx.body = {
      code: 0,
      data: null,
      msg: '没有找到'
    }
  }
}

// 删除
const deleteForm = async (ctx, next) => {
  const req = ctx.request.body;
  // 获取表单
  const result = await Form_col.findOneAndDelete({
    formId: req.formId,
  });

  ctx.status = 200;
  if (result) {
    ctx.body = {
      code: 1,
      msg: '删除成功'
    }
    return;
  }
  ctx.body = {
    code: 0,
    msg: '删除失败'
  };
}

// 填写表单
const fillForm = async (ctx, next) => {
  const req = ctx.request.body;
  ctx.status = 200;
  
  // 获取表单
  const form = await Form_col.findOne({
    formId: req.formId,
  });
  const answers = [...form.answers,req.answers];
  const result = await Form_col.findOneAndUpdate({
    formId: req.formId,
  }, {
    answers,
  });


  ctx.body = {
    code: 1,
    msg: '提交成功',
  }
}

module.exports = {
  createForm,
  getForms,
  deleteForm,
  getFormDetail,
  fillForm,
}