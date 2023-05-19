// 导入mongoose
const mongoose = require('mongoose');

// 创建文档的结构对象
const AccountSchema = new mongoose.Schema({
    // 事件
    title: {
        type: String,
        require: true,
    },
    // 时间
    time: Date,
    // 类型
    type: {
        type: Number,
        default: -1
    },
    // 金额
    account: {
        type: Number
    },
    // 备注
    remarks: {
        type: String
    }

});

// 创建模型对象
const AccountModel = mongoose.model('accounts', AccountSchema);

// 暴露模型对象
module.exports = AccountModel;