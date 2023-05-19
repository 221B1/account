const express = require('express');
// 导入moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
// 导入中间件
const checkLoginMiddleware = require('../../middleware/checkLoginMiddleware');

const router = express.Router();

// 设置首页
router.get('/', (req, res, next)=>{
  res.redirect('/account');
})

/* 记账本列表 */
router.get('/account', checkLoginMiddleware, function(req, res, next) {
  // // 获取所有账单信息
  // let accounts = db.get("accounts").value();
  // res.render('account',{accounts: accounts});

  // 数据库读取
  // 注意这里数据库集合文档对象中type是设置为数字，而最初在db.json中设置的是字符串，所以需要到ejs文件中将判断语句做一下修改，将1和-1的引号去掉
  // 注意，若要修改时间显示的格式，在ejs文件中进行修改，同时要将moment包传给ejs
  AccountModel.find().sort({time:-1}).then((data)=>{
    console.log('读取成功');
    res.render('account',{accounts: data, moment});
  }).catch(err=>{
    res.status(500).send('插入失败')
    console.log(err);
    return;
  })
});

// 添加记录
router.get('/account/create', checkLoginMiddleware, function(req, res, next) {
  res.render('create');
})

// 提交响应
router.post('/account', checkLoginMiddleware, function(req, res, next) {
  // // 生成id
  // const id = shortid.generate();
  // // 因为有中间件，所以可以直接使用req.body
  // db.get('accounts')
  //   .unshift({id:id, ...req.body})
  //   .write();
  // res.render('success',{done: "添加", url: "/account"});

  // 数据库操作
  AccountModel.create({
    ...req.body,
    // 修改time属性的值，要转成Date模式
    time: moment(req.body.time).toDate()
    }).then(()=>{
      console.log('添加成功');
      res.render('success',{done: "添加", url: "/account"});
    }).catch(err=>{
      res.status(500).send('插入失败')
      console.log(err);
      return;
    })
})

// 删除账单
router.get('/account/:id', checkLoginMiddleware, function(req, res, next) {
  let id = req.params.id;
  // db.get('accounts')
  //   .remove({ id: id })
  //   .write();
  // res.render('success',{done: "删除", url: "/account"})

  // 数据库操作
  AccountModel.deleteOne({id:id}).then(()=>{
    res.render('success',{done: "删除", url: "/account"})
  }).catch(err=>{
    res.status(500).send('删除失败')
    console.log(err);
    return;
  })

})

module.exports = router;
