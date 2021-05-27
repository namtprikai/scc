import Mock from 'mockjs';
import adminAPI from './admin';
import userAPI from './user';
import tableAPI from './table';
// Admin
Mock.mock(/\/admin\/login/, 'post', adminAPI.login);
Mock.mock(/\/admin\/./, 'get', adminAPI.getInfo);
Mock.mock(/\/admin\//, 'get', adminAPI.getList);
Mock.mock(/\/admin\/logout/, 'post', adminAPI.logout);
// User
Mock.mock(/\/user\/login/, 'post', userAPI.login);
Mock.mock(/\/user\/info/, 'get', userAPI.getInfo);
Mock.mock(/\/user\/logout/, 'post', userAPI.logout);

// Table
Mock.mock(/\/table\/list/, 'get', tableAPI.list);

export default Mock;
