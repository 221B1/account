var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const {secret} = require('../../config/config');

// 导入model
const UsersModel = require('../../models/UsersModel');

// 导入MD5
const md5 = require('md5');

// 登录
// router.get('/login', (req, res)=>{
//     // res.render('login');
//     res.json({
//         code:'0000',
//         msg:'登录成功',
//         data:req.body
//     })
// })

router.post('/login', (req, res)=>{
    // 查询数据库
    let {username, password} = req.body;
    UsersModel.findOne({username:username, password:md5(password)}).then((data)=>{
        if(!data){
            return res.json({
                code:'2002',
                msg:"用户或密码错误",
                data:null
            })
        }
        // 生成token
        let token = jwt.sign({
            username:data.username,
            _id:data._id
        },secret,{
            expiresIn:60*60*24*7
        })

        // 响应token
        res.json({
            code:'0000',
            msg:"登录成功",
            data:token
        })

        console.log(data);
        // res.send(data)
        // res.render('success',{done:'登录', url:'/account'})
    }).catch(err=>{
        return res.json({
            code:'2001',
            msg:"数据库连接错误",
            data:null
        })
    })
})

// 退出登录路由规则
router.post('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.render('success',{done:'退出',url:"/login"})
    })
})

module.exports = router;
