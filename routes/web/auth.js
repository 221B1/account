var express = require('express');
var router = express.Router();

// 导入model
const UsersModel = require('../../models/UsersModel');

// 导入MD5
const md5 = require('md5');

// 注册
router.get('/reg', (req, res)=>{
    res.render('reg');
})

router.post('/reg', (req, res)=>{
    console.log(req.body)
    UsersModel.create({...req.body, password: md5(req.body.password)}).then((data)=>{
        res.render('success',{done:"注册", url:'/account'})
    }).catch(err=>{
        res.send('注册失败');
    })
})

// 登录
router.get('/login', (req, res)=>{
    res.render('login');
})

router.post('/login', (req, res)=>{
    // 查询数据库
    let {username, password} = req.body;
    UsersModel.findOne({username:username, password:md5(password)}).then((data)=>{
        if(!data){
            return res.send('账号或密码错误');
        }
        // 写入session
        req.session.username = data.username;
        req.session._id = data._id;

        res.render('success',{done:'登录', url:'/account'})
    }).catch(err=>{
        console.log(err);
        res.send('404');
    })
})

// 退出登录路由规则
router.post('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.render('success',{done:'退出',url:"/login"})
    })
})

module.exports = router;
