import { get, post } from '@/util/http';
export const test = () => get('/text');
export const login = params => post('login', params);
export const quit = () => get('quit');
export const reg = params => post('reg', params);
export const hotSale = () => post('hotsale');
export const saleGroup = () => post('salegroup');
export const discover = () => post('discover');
export const getCartCount = () => post('getCartCount');
export const getCart = () => post('getCart');
export const updateCartCount = params => post('updateCartCount', params);
export const addToCart = params => post('addToCart', params);
export const delFromCart = params => post('delFromCart', params);
export const getAddress = () => post('getAddress');
export const getOrder = () => post('getOrder');
export const createOrder = params => post('createOrder', params);
export const getGoodById = params => post('getGoodById', params);
//获取班级接口
export const getClassList = () => post('getClassList');
export const getClass = params => post('getClass', params);
export const addClass = params => post('addClass', params);
export const updateClass = params => post('updateClass', params);
export const addStudent = params => post('addStudent', params);
export const getOneClassStudentlist = params => post('getOneClassStudentlist', params);
export const getStudentlist = () => post('getStudentlist');
export const getClassStudentlist = () => post('getClassStudentlist');
export const updateStudentgiveclass = params => post('updateStudentgiveclass', params);
export const updateStudentclass = params => post('updateStudentclass', params);
export const searchStudent = params => post('searchStudent', params);
export const getStudent = params => post('getStudent', params);
export const updateStudentDetail = params => post('updateStudentDetail', params);
export const delCourse = params => post('delCourse', params);
export const getdelCourseHistory = params => post('getdelCourseHistory', params);
export const handleHistory = params => post('handleHistory', params);
export const getReport = params => post('getReport', params);