// 导入mongoose
const mongoose = require('mongoose');

// 创建文档的结构对象
const UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// 创建模型对象
const UsersModel = mongoose.model('users', UsersSchema);

// 暴露模型对象
module.exports = UsersModel;