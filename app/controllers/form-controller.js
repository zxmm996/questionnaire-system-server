const fs = require('fs');
const xlsx = require('node-xlsx');
const uuidv1 = require('uuid/v1');
const config = require('./../../config');
const Form_col = require('./../models/form');

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
  }).sort({_id: -1});


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

// 导出表单
const questionTypeMapper = {
    input: '填空题',
    radio: '单选题',
    checkbox: '多选题',
}
const exportForm = async (ctx, next) => {
  const req = ctx.request.body;
  ctx.status = 200;

  // 获取表单
  const form = await Form_col.findOne({
    formId: req.formId,
  });

  const formData = [];
  formData.push([form.title]);
  const length = form.questions.length;

  function generator(questions, index) {
    const question = questions[index];
    formData.push([`第${index + 1}题：${question.title}[${questionTypeMapper[question.type]}]`]);
    if (question.type === 'input') {
      formData.push(['序号', '答案文本']);
    } else {
      formData.push(['选项', '小计', '比例']);
    }
    
    const dataSource = [];
    form.answers.forEach(answer => {
      dataSource.push(answer.find(obj => obj.id === question.id));
    })

      if (question.type === 'input') {
        form.answers.forEach((item, index) => {
          formData.push([index + 1, dataSource[index].answer])
        });
      } else if (question.type === 'radio') {
        question.options.forEach((item, index) => {
          const count = dataSource.filter(source => source.answer === item.id).length;
          formData.push([item.value, count, (count / form.answers.length).toFixed(4) * 100 + '%']);
        });
      } else if (question.type === 'checkbox') {
        question.options.forEach((item, index) => {
          const count = dataSource.filter(source => source.answer.indexOf(item.id) > -1).length;
          formData.push([item.value, count, (count / form.answers.length).toFixed(4) * 100 + '%']);
        });
      }


    if (index < length -1) {
      generator(questions, index + 1);
    }
  }

  generator(form.questions, 0);
  
  var buffer = xlsx.build([{name: "mySheet", data: formData}])

  fs.writeFileSync(`./static/${form.formId}.xlsx`, buffer)
  
  ctx.body = {
    code: 1,
    data: `http://localhost:3000/${form.formId}.xlsx`,
  }
}

module.exports = {
  createForm,
  getForms,
  deleteForm,
  getFormDetail,
  fillForm,
  exportForm,
}