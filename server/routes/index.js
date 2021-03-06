var express = require('express');
var router = express.Router();
var connection = require('../db/connect');

//登录
router.post('/login', function(req, res, next) {
  var userName = req.body.userName;
  var password = req.body.password;
  var sql = 'SELECT * FROM user WHERE Username=?';
  var sqlParams = [userName];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    if (result.length === 0) {
      res.json({
        status: 0,
        msg: '用户名不存在',
        data: ''
      });
      return;
    }
    if (password === result[0].Password) {
      res.cookie('username', result[0].Username, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 365
      });
      res.json({
        status: 200,
        msg: 'success',
        data: ''
      });
    } else {
      res.json({
        status: 0,
        msg: '密码错误',
        data: ''
      });
    }
  });
});

//注册
router.post('/reg', function(req, res, next) {
  var userName = req.body.userName;
  var password = req.body.password;
  var sql = 'SELECT * FROM user WHERE Username=?';
  var sqlParams = [userName];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    if (result.length !== 0) {
      res.json({
        status: 0,
        msg: '用户已存在！',
        data: ''
      });
      return;
    }
    sql = 'INSERT INTO user(Username,Password) VALUES(?,?)';
    sqlParams = [userName, password];
    connection.query(sql, sqlParams, function(err, result) {
      if (err) {
        res.json({
          status: 500,
          msg: err,
          data: ''
        });
        return;
      }
      res.json({
        status: 200,
        msg: 'success',
        data: ''
      });
    });
  });
});
// 退出
router.post('/quit', function(req, res, next) {
  res.clearCookie();
});
// 热销商品
router.post('/hotsale', function(req, res, next) {
  var sql = `SELECT * FROM good WHERE find_in_set('1',GoodItem)`;
  connection.query(sql, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
// 团购商品
router.post('/salegroup', function(req, res, next) {
  var sql = `SELECT * FROM good WHERE find_in_set('2',GoodItem)`;
  connection.query(sql, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
// 发现
router.post('/discover', function(req, res, next) {
  var sql = `SELECT * FROM good WHERE find_in_set('3',GoodItem)`;
  connection.query(sql, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
// 获取购物车里商品数量
router.post('/getCartCount', function(req, res, next) {
  var username = req.cookies.username;
  var sql = `SELECT COUNT(*) as count FROM cart WHERE Username=?`;
  var sqlParams = username;
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
// 获取购物车所有信息
router.post('/getCart', function(req, res, next) {
  var username = req.cookies.username;
  var sql = `SELECT cart.Cartcount,good.* FROM cart,good WHERE cart.Goodid=good.Goodid AND Username=?`;
  var sqlParams = username;
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
// 更新购物车商品数目
router.post('/updateCartCount', function(req, res, next) {
  var username = req.cookies.username;
  var id = req.body.id;
  var num = req.body.num;
  var sql = `UPDATE cart SET Cartcount=? WHERE Username=? AND Goodid=?`;
  var sqlParams = [num, username, id];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: ''
    });
  });
});
// 添加到购物车
router.post('/addToCart', function(req, res, next) {
  var username = req.cookies.username;
  var id = req.body.id;
  var num = req.body.num;
  var sql = `SELECT Cartcount FROM cart WHERE Goodid=? AND Username=?`;
  var sqlParams = [id, username];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    if (result.length === 0) {
      sql = `INSERT INTO cart VALUES (?, ?, ?);`;
      sqlParams = [username, id, num];
      connection.query(sql, sqlParams, function(err, res1) {
        if (err) {
          res.json({
            status: 500,
            msg: err,
            data: ''
          });
          return;
        }
        res.json({
          status: 200,
          msg: 'success',
          data: ''
        });
      });
    } else {
      num += result[0].Cartcount;
      sql = `UPDATE cart SET Cartcount=? WHERE Username=? AND Goodid=?`;
      sqlParams = [num, username, id];
      connection.query(sql, sqlParams, function(err, res2) {
        if (err) {
          res.json({
            status: 500,
            msg: err,
            data: ''
          });
          return;
        }
        res.json({
          status: 200,
          msg: 'success',
          data: ''
        });
      });
    }
  });
});
// 删除购物车商品
router.post('/delFromCart', function(req, res, next) {
  var username = req.cookies.username;
  var delId = req.body.delId;
  var delIdStr = '(' + delId.toString() + ')';
  var sql = `DELETE FROM cart WHERE Username=? AND Goodid in ${delIdStr}`;
  var sqlParams = [username];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: ''
    });
  });
});
// 根据id获取商品
router.post('/getGoodById', function(req, res, next) {
  var username = req.cookies.username;
  var goodId = req.body.goodId;
  var goodIdStr = '(' + goodId.toString() + ')';
  var sql = `SELECT * FROM good WHERE Goodid in ${goodIdStr}`;
  var sqlParams = [username];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
// 获取收货地址
router.post('/getAddress', function(req, res, next) {
  var username = req.cookies.username;
  var sql = `SELECT * FROM address WHERE Username=?`;
  var sqlParams = [username];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
// 获取订单
router.post('/getOrder', function(req, res, next) {
  var username = req.cookies.username;
  var sql = `SELECT *  FROM userorder,usersuborder,good WHERE userorder.Username=? AND userorder.Orderid=usersuborder.MainOrderId AND usersuborder.GoodId = good.Goodid;`;
  var sqlParams = [username];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    let resultArr = [];
    let obj = {};
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      if (obj[item.Orderid]) {
        obj[item.Orderid].goods.push(item);
      } else {
        const { Orderid, Addressid, totalMoney, Status } = item;
        obj[item.Orderid] = {
          Orderid,
          Addressid,
          totalMoney,
          Status,
          goods: [item]
        };
      }
    }
    Object.keys(obj).forEach(function(key) {
      resultArr.push(obj[key]);
    });
    res.json({
      status: 200,
      msg: 'success',
      data: resultArr
    });
  });
});
// 生成订单
router.post('/createOrder', function(req, res, next) {
  var username = req.cookies.username;
  var addressId = req.body.addressId;
  var goods = req.body.goods;
  var totalMoney = req.body.totalMoney;
  sql = 'INSERT INTO userorder(Username,Addressid,Status,totalMoney) VALUES(?,?,1,?)';
  var sqlParams = [username, addressId, totalMoney];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    var arr = [];
    for (var i = 0; i < goods.length; i++) {
      arr.push([result.insertId, goods[i].Goodid, goods[i].Cartcount]);
    }
    sql = 'INSERT INTO usersuborder(MainOrderId,GoodId,Count) VALUES ?';
    sqlParams = arr;
    connection.query(sql, [sqlParams], function(err, result) {
      if (err) {
        res.json({
          status: 500,
          msg: err,
          data: ''
        });
        return;
      }
      res.json({
        status: 200,
        msg: 'success',
        data: result
      });
    });
  });
});
//获取所有班级信息
router.post('/getClassList', function(req, res, next) {
  var username = req.cookies.username;
  var sql = `SELECT classid,classname FROM class `;
  var sqlParams = username;
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
//获取班级信息
router.post('/getClass', function(req, res, next) {
  var id = req.body.id;
  console.log(id);
  var sql = `SELECT * FROM class WHERE classid=?`;
  var sqlParams = [id];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
//添加班级信息
router.post('/addClass', function(req, res, next) {
  var classname = req.body.classname;
  sql = 'INSERT INTO class(classname) VALUES(?)';
  var sqlParams = [classname];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//修改班级信息
router.post('/updateClass', function(req, res, next) {
  var classname = req.body.updatename;
  var classid = req.body.updateid;

  sql = 'INSERT INTO class(classname) VALUES(?)';
  var sql = `UPDATE class SET classname=? WHERE classid=?`;
  var sqlParams = [classname, classid];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
//获取学员信息————+
router.post('/getStudent', function(req, res, next) {
  var id = req.body.id;
  var sql = `SELECT * FROM student WHERE studentid=?`;
  var sqlParams = [id];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//添加学员信息
router.post('/addStudent', function(req, res, next) {
  var name = req.body.name;
  var phonenum = req.body.phonenum;
  // var price = req.body.price;
  // var classnum = req.body.classnum;
  // var classnumfree = req.body.classnum;
  // var giveclass = req.body.giveclass;
  // var giveclassfree = req.body.giveclass;
  var createdate = req.body.createdate;
  var foldleadnew = req.body.foldleadnew;
  var belong_class_id = req.body.belong_class_id;
  // var createdate = req.body.createdate;
  var remarks = req.body.remarks;

  // console.log(req.body);
  sql = 'INSERT INTO student(studentname,phonenum,remarks,createdate,foldleadnew,belong_class_id) VALUES(?,?,?,?,?,?)';
  var sqlParams = [name, phonenum, remarks, createdate, foldleadnew, belong_class_id];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
//获取所有学员列表
router.post('/getStudentlist', function(req, res, next) {
  var username = req.cookies.username;
  var sql = `SELECT * FROM student `;
  var sqlParams = username;
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//获取学员信息
router.post('/searchStudent', function(req, res, next) {
  var name = req.body.name;
  var sql = `SELECT student.studentid,student.studentname,class.classname,class.classid FROM student,class WHERE class.classid=student.belong_class_id and  studentname=?`;
  var sqlParams = [name];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});


// 更新学员购买课时信息
router.post('/updateStudentclass', function(req, res, next) {

  var belong_student_id = req.body.belong_student_id;
  var bugclassnum = req.body.bugclassnum;
  var addcoursedate = req.body.addcoursedate;
  var coursetype  = req.body.coursetype;
  var sql 
  if(coursetype === 'class'){
    sql = `UPDATE studentcourse SET bugclassnumfree=? WHERE belong_student_id=? and addcoursedate=?`;
  }else{
    sql = `UPDATE studentcourse SET giveclassfree=? WHERE belong_student_id=? and addcoursedate=?`;
  }
  // var sql = `UPDATE studentcourse SET bugclassnumfree=? WHERE belong_student_id=?`;
  var sqlParams = [bugclassnum, belong_student_id,addcoursedate];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: ''
    });
  });
});

// 更新学员个人信息
router.post('/updateStudentDetail', function(req, res, next) {
  var studentid = req.body.studentid;
  var studentname = req.body.studentname;
  var phonenum = req.body.phonenum;
  var belong_class_id = req.body.belong_class_id;
  var remarks = req.body.remarks;
  var sql = `UPDATE student SET studentname=?,phonenum=?,belong_class_id=?,remarks=? WHERE studentid=?`;
  var sqlParams = [studentname, phonenum, belong_class_id, remarks, studentid];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: ''
    });
  });
});


//消课
router.post('/delCourse', function(req, res, next) {
  var student = req.body.student;
  var studentid = req.body.studentid;
  var teacher = req.cookies.username;
  var coursetype = req.body.coursetype;
  var coursenum = req.body.coursenum;
  var coursedate = req.body.coursedate;
  var coursebefore = req.body.coursebefore;
  var courseafter = req.body.courseafter;
  var remarks = req.body.remarks;
  var classesprice = req.body.classesprice

  sql =
    'INSERT INTO course(student,studentid,teacher,coursetype,coursenum,classesprice,coursedate,coursebefore,courseafter,remarks) VALUES(?,?,?,?,?,?,?,?,?,?)';
  var sqlParams = [student, studentid, teacher, coursetype, coursenum,classesprice, coursedate, coursebefore, courseafter, remarks];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//查询个人消课信息
router.post('/getdelCourseHistory', function(req, res, next) {
  var studentid = req.body.studentid;
  sql =
    'select coursetype,coursenum,coursedate,teacher,coursebefore,remarks from course where studentid = ? order by courseid desc ';
  var sqlParams = [studentid];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//获取所有班级和学员人数
router.post('/getClassStudentlist', function(req, res, next) {
  var username = req.cookies.username;
  var sql = `select class.classid,class.classname,student.studentid,student.studentname from class left join student on class.classid=student.belong_class_id order by classid `;
  var sqlParams = username;
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//获取单个班级人员列表
router.post('/getOneClassStudentlist', function(req, res, next) {
  // var username = req.cookies.username;
  var classid = req.body.classid;
  var sql = `select * from student where belong_class_id = ? `;
  var sqlParams = [classid];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//消课
router.post('/handleHistory', function(req, res, next) {
  var type = req.body.type;
  var value = req.body.value;
  var username = req.cookies.username;

  sql = 'INSERT INTO handlehistory(username,type,value) VALUES(?,?,?)';
  var sqlParams = [username, type, value];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//获取报表
router.post('/getReport', function(req, res, next) {
  var datestart = req.body.datestart;
  var dateend = req.body.dateend;
  console.log(req.body);
  sql = 'select * from course where coursedate between ? and ?';
  var sqlParams = [datestart, dateend];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//获取添加课时
router.post('/getReportAddClass', function(req, res, next) {
  var datestart = req.body.datestart;
  var dateend = req.body.dateend;
  sql = 'select * from studentcourse where addcoursedate between ? and ?';
  var sqlParams = [datestart, dateend];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});

//增加课时
router.post('/addCourse', function(req, res, next) {
  var username = req.cookies.username;
  var price = req.body.price;
  var bugclassnum = req.body.classnum;
  var bugclassnumfree = req.body.classnum;
  var giveclass = req.body.giveclassnum;
  var giveclassfree = req.body.giveclassnum;
  var addcoursedate = req.body.addcoursedate;
  var remarks = req.body.remarks;
  var belong_student_id = req.body.belong_student_id;
  var priceeachclass = Math.round(parseFloat(price)/parseFloat(bugclassnum)*100)/100

  sql = 'INSERT INTO studentcourse(price,bugclassnum,priceeachclass,bugclassnumfree,giveclass,giveclassfree,addcoursedate,remarks,belong_student_id,username) VALUES(?,?,?,?,?,?,?,?,?,?)';
  var sqlParams = [price, bugclassnum, priceeachclass,bugclassnumfree,giveclass,giveclassfree,addcoursedate,remarks,belong_student_id,username];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});


//获取学员课时
router.post('/getStudentCourse', function(req, res, next) {
  var studentid = req.body.studentid;

  sql = 'select * from studentcourse where belong_student_id = ? ';
  var sqlParams = [studentid];
  connection.query(sql, sqlParams, function(err, result) {
    if (err) {
      res.json({
        status: 500,
        msg: err,
        data: ''
      });
      return;
    }
    res.json({
      status: 200,
      msg: 'success',
      data: result
    });
  });
});
module.exports = router;
