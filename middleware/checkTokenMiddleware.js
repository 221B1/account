const jwt = require('jsonwebtoken');

const {secret} = require('../config/config');

module.exports = (req, res, next) => {

    let token = req.get('token');

    if (!token) {
        res.json({
            code:'2003',
            msg:'token 缺失',
            data: null
        })
    }

    jwt.verify(token, secret, (err, data)=>{
        if (err){
            res.json({
                code:'2004',
                msg:"token校验失败",
                data: null
            })
        }
        // 保存用户信息
        req.user = data;
        //如果校验成功
        next();
    })

}