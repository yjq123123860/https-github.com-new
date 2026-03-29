// 内存存储模拟数据库
const users = [];
const tasks = [];
const schools = [];
const wechatAuths = []; // 微信授权信息表
const logger = require('./logger');

// 初始化示例数据
const initData = () => {
  // 初始化学校数据
  schools.push(
    { id: 1, name: '北京大学', address: '北京市海淀区颐和园路5号', contactPerson: '张老师', contactPhone: '13800138000' },
    { id: 2, name: '清华大学', address: '北京市海淀区清华园1号', contactPerson: '李老师', contactPhone: '13900139000' },
    { id: 3, name: '复旦大学', address: '上海市杨浦区邯郸路220号', contactPerson: '王老师', contactPhone: '13700137000' },
    { id: 4, name: '四川大学', address: '成都市武侯区一环路南一段24号', contactPerson: '刘老师', contactPhone: '13600136000' },
    { id: 5, name: '浙江大学', address: '杭州市西湖区余杭塘路866号', contactPerson: '陈老师', contactPhone: '13500135000' }
  );
  
  logger.info('Memory database initialized successfully');
};

const connectDB = async () => {
  initData();
  return Promise.resolve();
};

module.exports = {
  connectDB,
  users,
  tasks,
  schools,
  wechatAuths
};
