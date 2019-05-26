const config = require('./../../config');
const passport = require('./../utils/passport');
const User_col = require('./../models/user');
const Passport_col = require('./../models/password')
const uuidv1 = require('uuid/v1');


// 登录
const login = async (ctx, next) => {
  const req = ctx.request.body;

  // 获取用户的 userId
  const user = await User_col.findOne({
    account: req.account
  }, {
    _id: 0
  });
  if (!user) {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: '用户不存在'
    }
    return;
  }

  const userId = user.userId;

  // 获取数据库中的 hash
  const pass = await Passport_col.findOne({
    userId
  }, {
    hash: 1,
  });

  const match = await passport.validate(req.password, pass.hash);
  ctx.status = 200;
  if (match) {
    ctx.body = {
      code: 1,
      data: user
    }
    return;
  }

  ctx.body = {
    code: 0,
    msg: '用户名或密码错误'
  }
}

// 注册
const regist = async (ctx, next) => {
  const req = ctx.request.body;

  // 获取用户的 userId
  const user = await User_col.findOne({
    account: req.account
  });

  ctx.status = 200;
  if (user) {
    ctx.body = {
      code: 0,
      msg: '用户名重复'
    }
    return;
  }
  
  // 插入新用户
  const userId = uuidv1();
  const newUser = await User_col.create({
    userId,
    account: req.account,
    tel: req.tel,
    email: req.email,
  });

  if (newUser) {
    // 加密
    const hash = await passport.encrypt(req.password, config.saltTimes);
    const result = await Passport_col.create({
      userId: userId,
      hash
    })

    if (result) {
      ctx.body = {
        code: 1,
        msg: '注册成功！',
        data: {
          userId: newUser.userId,
          account: newUser.account
        }
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '注册失败！'
    };
  }
}

module.exports = {
  login,
  regist,
}