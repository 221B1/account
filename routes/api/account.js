var express = require('express');
var router = express.Router();

// 导入moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

const checkTokenMiddleware = require('../../middleware/checkTokenMiddleware')

/* 记账本列表 */
router.get('/account', checkTokenMiddleware, function(req, res, next) {
  // // 获取所有账单信息
  // 数据库读取
  // 注意这里数据库集合文档对象中type是设置为数字，而最初在db.json中设置的是字符串，所以需要到ejs文件中将判断语句做一下修改，将1和-1的引号去掉
  // 注意，若要修改时间显示的格式，在ejs文件中进行修改，同时要将moment包传给ejs
  AccountModel.find().sort({time:-1}).then((data)=>{
    // 响应成功的提示，使用接口时与http响应不同
    // 此时返回的是json文件，json文件如何使用是前端的工作
    res.json({
        // 响应编号
        code: '0000',
        // 响应的信息
        msg: '读取成功',
        // 响应的数据
        data: data
    })
  }).catch(err=>{
    return res.json({
        // 响应编号,不用设置响应状态码了，因为一般的接口服务返回结果时状态信息已经在标识在code中了
        code: '1001',
        // 响应的信息
        msg: '读取失败',
        // 响应的数据
        data: null     
    })
    return;
  })
});

// 添加记录 
// 在接口中不会需要返回html，只会返回json数据，所以这里可以删除
// router.get('/account/create', function(req, res, next) {
//   res.render('create');
// })

// 提交响应
router.post('/account', checkTokenMiddleware, function(req, res, next) {
  // 数据库操作
  AccountModel.create({
    ...req.body,
    // 修改time属性的值，要转成Date模式
    time: moment(req.body.time).toDate()
    }).then((data)=>{
      res.json({
        code: '0000',
        msg: '添加成功',
        data: data
      })
    }).catch(err=>{
      return res.json({
        code: '1002',
        msg: '创建失败',
        data: null
      })
    })
})

// 删除账单
router.delete('/account/:id', checkTokenMiddleware, function(req, res, next) {
  let id = req.params.id;
  // 数据库操作
  AccountModel.deleteOne({id:id}).then(()=>{
    res.json({
        code: '0000',
        msg: '删除成功',
        data: {}
    })
  }).catch(err=>{
    return res.json({
        code: '1003',
        msg: '删除失败',
        data: null
    })
  })

})

// 获取单个账单
router.get('/account/:id', checkTokenMiddleware, function(req, res, next){
    let {id} = req.params;
    AccountModel.findById(id).then((data)=>{
        res.json({
            code:'0000',
            msg:'成功获取单条信息',
            data: data
        })
    }).catch(err=>{
        return res.json({
            code:'1004',
            msf:'获取失败',
            data: null
        })
    })
})

// 更新账单信息,回调套回调：回调地狱
router.patch('/account:id', function(req, res, next){
    let {id} = req.params;
    AccountModel.updateOne({_id:id}, req.body).then((data)=>{
        res.json({
            code:'0000',
            msg:'更新成功',
            data:data
        }).catch(err=>{
        res.json({
            code:'1005',
            msg:'更新失败',
            data:null           
        })
    })
})})

module.exports = router;
