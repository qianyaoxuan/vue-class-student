<template>
  <div class="home">

        <van-nav-bar
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
<van-cell-group>
  <van-cell title="姓名" is-link  :value="name"  @click='updateStudentContent' />
  <van-cell title="所属班级" is-link  :value="belongclass" @click='updateStudentContent' />
  <van-cell title="手机号" is-link  :value="phonenum" @click='updateStudentContent' />
  <van-cell title="购买课时" is-link :value="classnum"  @click='delClass' />
  <van-cell title="已赠送课时"  is-link :value="giveclass" @click='delGiveClass'  />
  <van-cell  v-if='foldleadnew===1' is-link  title="是否老带新" value="是"   @click='updateStudentContent'/>
  <van-cell  v-else is-link  title="是否老带新" value="否"  @click='updateStudentContent' />
   <van-cell title="备注"  is-link :value="remarks" @click='updateStudentContent'  />
</van-cell-group>
<van-dialog v-model="dialogUpdateStudentContent" title="更新学员信息" show-cancel-button @confirm='updateStudentContentConfirm'>
   <van-field v-model="content.studentname" label="姓名" />
   <van-field v-model="content.phonenum"  type="tel" label="手机号" />

<van-field
  readonly
  clickable
  name="picker"
  :value="content.belongclass"
  label="班级"
  placeholder="点击选择班级"
  @click="showPicker = true"
/>
<van-popup v-model="showPicker" position="bottom">
<van-picker
        show-toolbar
        :columns="classList"
        value-key="text"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
      </van-popup>
         <van-field v-model="content.remarks" label="备注" />
</van-dialog>
<van-dialog v-model="dialogAddClass" title="增加课时"   show-cancel-button @confirm='addCourseConfirm' >
  <!-- <img src="https://img.yzcdn.cn/vant/apple-3.jpg" /> -->
    <van-cell title="剩余课时"  type="digit"  :value="classnum"   />
    <van-cell title="剩余赠送课时"  type="digit"  :value="giveclass"   />
   <van-field v-model="add.classnum" type="digit"  label="购买课时添加" />
   <van-field v-model="add.giveclassnum"  type="digit" label="赠送课时添加" />
   <!-- <van-field v-model="date" label="时间" /> -->
</van-dialog>
<van-dialog v-model="dialogClass" title="购买课时销课"  :before-close="onBeforeClose" show-cancel-button >
  <!-- <img src="https://img.yzcdn.cn/vant/apple-3.jpg" /> -->
    <van-cell title="剩余课时" :value="classnum"   />
   <van-field v-model="use" label="本次销耗课时" />
   <!-- <van-field v-model="date" label="时间" /> -->
   <van-datetime-picker
  v-model="date"
  type="date"
  title="选择年月日"
  
  :min-date="minDate"
  :max-date="maxDate"
/>
</van-dialog>
<van-dialog v-model="dialogGiveClass"  :before-close="onBeforeGiveClose" title="赠送课时销课" show-cancel-button >
      <van-cell title="剩余课时" :value="giveclass"   />
   <van-field v-model="usegive" type="digit"  label="本次销耗课时" />
    <van-datetime-picker
  v-model="dategive"
  type="date"
  title="选择年月日"
  :min-date="minDate"
  :max-date="maxDate"
/>
</van-dialog>
<van-button type="primary" size="large"  @click='addCourse'>添加课时</van-button>

  <div>销课历史</div>
    <div>
  <van-cell-group>
      <van-row >
  <van-col span="4">  <van-cell title="类型" /></van-col>
  <van-col span="8">  <van-cell  title='课时'  /></van-col>
  <van-col span="7">  <van-cell title="时间" /></van-col>
  <van-col span="5">  <van-cell  value="操作人" /></van-col>
</van-row>

</van-cell-group>  
    <van-cell-group v-for='(item,index) in delcourseHistoryList' :key='index'>
      <van-row >
  <van-col span="4">  <van-cell :value="getType(item)" /></van-col>
  <van-col span="8">  <van-cell  :title='item.coursenum' :label="getCourseBeforeAndAfter(item)"  /></van-col>
  <van-col span="7">  <van-cell :value="getLocalTime(item.coursedate)" /></van-col>
  <van-col span="5">  <van-cell  :value="item.teacher" /></van-col>
</van-row>

</van-cell-group>  
    </div>
  </div>
</template>

<script>
import goodItem from '@/components/goodItem/goodItem';
import scrollX from '@/components/scroll/scrollX';
import backgroundImg from '@/components/backgroundImg/backgroundImg';
import tabItem from '@/components/tabItem/tabItem';
import {
  hotSale,
  saleGroup,
  getClass,
  getClassList,
  getStudent,
  updateStudentgiveclass,
  handleHistory,
  updateStudentclass,
  getdelCourseHistory,
  updateStudentDetail,
  delCourse,
  discover
} from '@/api/api';
import { mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      value: '',
      classList: [],
      showPicker: false,
      name: '',
      belongclass: '',
      classnum: '',
      phonenum: '',
      remarks: '',
      giveclass: '',
      foldleadnew: '',
      dialogGiveClass: false,
      dialogClass: false,
      dialogUpdateStudentContent: false,
      dialogAddClass: false,
      use: '',
      date: '',
      usegive: '',
      dategive: '',
      add: {
        classnum: '',
        giveclassnum: ''
      },
      content: {
        studentname: '',
        phonenum: '',
        remarks: ''
      },
      delcourseHistoryList: [],
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2025, 10, 1)
    };
  },
  activated() {
    this.name = '';
    this.classnum = '';
    this.phonenum = '';
    this.remarks = '';
    this.giveclass = '';
    this.foldleadnew = '';
    this.belongclass = '';
    var sid = this.$route.query.studentid;
    var obj = {
      id: sid
    };

    getStudent(obj)
      .then(result => {
        if (result.status !== 200) {
          this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

          return;
        }
        // console.log(result);
        var res = result.data[0];
        this.name = res.studentname;
        this.classnum = res.bugclassnum;
        this.phonenum = res.phonenum;
        this.remarks = res.remarks;
        this.giveclass = res.giveclass;
        this.foldleadnew = res.foldleadnew;
        var cobj = {
          id: res.belong_class_id
        };
        getClass(cobj)
          .then(result => {
            if (result.status !== 200) {
              this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

              return;
            }
            // console.log(result);
            this.belongclass = result.data[0].classname;
            this.belongclassid = result.data[0].classid;
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
    var sobj = {
      studentid: sid
    };
    getdelCourseHistory(sobj)
      .then(result => {
        if (result.status !== 200) {
          this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

          return;
        }
        // console.log(result);
        this.delcourseHistoryList = result.data;
        // this.belongclass = result.data[0].classname;
      })
      .catch(error => {
        console.log(error);
      });
  },
  components: {
    goodItem,
    scrollX,
    backgroundImg,

    tabItem
  },
  computed: {
    goodItems() {
      return {
        推荐: this.hotGoods,
        拼团: this.saleGroupGoods,
        低价: this.discoverGoods,
        发现: this.hotGoods,
        火爆: this.saleGroupGoods
      };
    }
  },
  methods: {
    onConfirm(value) {
      this.content.belongclass = value.text;
      this.content.belongclassid = value.value;

      this.showPicker = false;
    },
    addSubmit() {},
    delClass() {
      this.dialogClass = true;
      this.use = '';
    },

    onBeforeClose(action, done) {
      if (action === 'confirm') {
        console.log(parseInt(this.use));
        if (this.use === '' || parseInt(this.use) <= 0) {
          this.$toast.success('请正确输入课时');
          done(false); //不关闭弹框
        } else if (parseInt(this.use) > parseInt(this.classnum)) {
          this.$toast.success('剩余课时不够');
          done(false); //不关闭弹框
        } else {
          this.delClassConfirm();
          setTimeout(done, 500);
        }
        // setTimeout(done, 1000);

        // setTimeout(done, 1000);
      } else if (action === 'cancel') {
        done();
      }
    },
    addCourseConfirm() {
      console.log(this.add.classnum);
      var newclassnum;
      var newgiveclassnum;
      if (this.add.classnum) {
        newclassnum = parseInt(this.classnum) + parseInt(this.add.classnum);
      } else {
        newclassnum = parseInt(this.classnum);
      }

      if (this.add.giveclassnum) {
        newgiveclassnum = parseInt(this.giveclass) + parseInt(this.add.giveclassnum);
      } else {
        newgiveclassnum = parseInt(this.giveclass);
      }
      let addobj = {
        name: this.name,
        bugclassnum: newclassnum
      };
      updateStudentclass(addobj)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
            return;
          }
          let obj = {
            name: this.name,
            giveclass: newgiveclassnum
          };
          updateStudentgiveclass(obj)
            .then(result => {
              if (result.status !== 200) {
                this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                return;
              }
              var sid = this.$route.query.studentid;
              let obj = {
                id: sid
              };
              getStudent(obj)
                .then(result => {
                  if (result.status !== 200) {
                    this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

                    return;
                  }
                  var res = result.data[0];
                  this.classnum = res.bugclassnum;
                  this.giveclass = res.giveclass;
                  this.$toast.success('加课成功~');
                  var sobj = {
                    studentid: res.studentid
                  };
                  var valuestr =
                    '学员增加课程,姓名：' +
                    this.name +
                    ';id：' +
                    this.$route.query.studentid +
                    ';买课添加：' +
                    this.add.classnum +
                    ';赠课添加：' +
                    this.add.giveclassnum +
                    ';时间：' +
                    this.getLocalTime(Date.parse(new Date()));
                  let handletype = {
                    type: 'addcourse',
                    value: valuestr
                  };
                  handleHistory(handletype)
                    .then(result => {
                      if (result.status !== 200) {
                        this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                        return;
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    delClassConfirm() {
      var freeclassnum = parseInt(this.classnum) - parseInt(this.use);
      let obj = {
        name: this.name,
        bugclassnum: freeclassnum
      };
      updateStudentclass(obj)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

            return;
          }
          var time = this.date.getTime() + '';
          let delobj = {
            studentid: this.$route.query.studentid,
            student: this.name,
            coursetype: 'class',
            coursenum: this.use,
            coursedate: time,
            coursebefore: this.classnum,
            courseafter: freeclassnum + ''
          };
          // console.log(delobj);
          delCourse(delobj)
            .then(result => {
              if (result.status !== 200) {
                this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

                return;
              }
              var sid = this.$route.query.studentid;
              let obj = {
                id: sid
              };
              getStudent(obj)
                .then(result => {
                  if (result.status !== 200) {
                    this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

                    return;
                  }
                  var res = result.data[0];
                  this.classnum = res.bugclassnum;
                  this.giveclass = res.giveclass;
                  this.$toast.success('销课成功~');
                  var sobj = {
                    studentid: res.studentid
                  };
                  getdelCourseHistory(sobj)
                    .then(result => {
                      if (result.status !== 200) {
                        this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

                        return;
                      }
                      // console.log(result);
                      this.delcourseHistoryList = result.data;
                      var valuestr =
                        '学员销课,姓名：' +
                        delobj.student +
                        ';id：' +
                        delobj.studentid +
                        ';类型： 买课' +
                        ';时间：' +
                        this.getLocalTime(delobj.coursedate) +
                        ';课时：' +
                        delobj.coursenum +
                        '；销课前课时：' +
                        delobj.coursebefore +
                        ';剩余：' +
                        delobj.courseafter;
                      let handletype = {
                        type: 'delcourse',
                        value: valuestr
                      };
                      handleHistory(handletype)
                        .then(result => {
                          if (result.status !== 200) {
                            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                            return;
                          }
                        })
                        .catch(error => {
                          console.log(error);
                        });
                    })
                    .catch(error => {
                      console.log(error);
                    });
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    onBeforeGiveClose(action, done) {
      if (action === 'confirm') {
        console.log(parseInt(this.usegive));
        if (this.usegive === '' || parseInt(this.usegive) <= 0) {
          this.$toast.success('请正确输入课时');
          done(false); //不关闭弹框
        } else if (parseInt(this.usegive) > parseInt(this.giveclass)) {
          this.$toast.success('剩余课时不够');
          done(false); //不关闭弹框
        } else {
          this.delGiveClassConfirm();
          setTimeout(done, 500);
        }
        // setTimeout(done, 1000);

        // setTimeout(done, 1000);
      } else if (action === 'cancel') {
        done();
      }
    },
    delGiveClassConfirm() {
      var freegiveclassnum = parseInt(this.giveclass) - parseInt(this.usegive);
      let obj = {
        name: this.name,
        giveclass: freegiveclassnum
      };
      updateStudentgiveclass(obj)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
            return;
          }
          // console.log(result);
          var givetime = this.dategive.getTime() + '';
          var delobj = {
            student: this.name,
            studentid: this.$route.query.studentid,
            coursetype: 'giveclass',
            coursenum: this.usegive,
            coursedate: givetime,
            coursebefore: this.giveclass,
            courseafter: freegiveclassnum + ''
          };
          delCourse(delobj)
            .then(result => {
              if (result.status !== 200) {
                this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                return;
              }
              var sid = this.$route.query.studentid;
              let obj = {
                id: sid
              };
              getStudent(obj)
                .then(result => {
                  if (result.status !== 200) {
                    this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

                    return;
                  }
                  var res = result.data[0];
                  this.classnum = res.bugclassnum;
                  this.giveclass = res.giveclass;
                  this.$toast.success('销课成功~');

                  var sobj = {
                    studentid: res.studentid
                  };
                  getdelCourseHistory(sobj)
                    .then(result => {
                      if (result.status !== 200) {
                        this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

                        return;
                      }
                      // console.log(result);
                      this.delcourseHistoryList = result.data;
                      var valuestr =
                        '学员销课,姓名：' +
                        delobj.student +
                        ';id：' +
                        delobj.studentid +
                        ';类型： 赠课' +
                        ';时间：' +
                        this.getLocalTime(delobj.coursedate) +
                        ';课时：' +
                        delobj.coursenum +
                        '；销课前课时：' +
                        delobj.coursebefore +
                        ';剩余：' +
                        delobj.courseafter;
                      let handletype = {
                        type: 'delcourse',
                        value: valuestr
                      };
                      handleHistory(handletype)
                        .then(result => {
                          if (result.status !== 200) {
                            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                            return;
                          }
                        })
                        .catch(error => {
                          console.log(error);
                        });
                    })
                    .catch(error => {
                      console.log(error);
                    });
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateStudentContentConfirm() {
      let updateobj = {
        studentid: this.$route.query.studentid,
        studentname: this.content.studentname,
        phonenum: this.content.phonenum,
        remarks: this.content.remarks,
        belong_class_id: this.content.belongclassid
      };
      if (this.content.studentname === '') {
        this.$toast.fail('姓名不能为空');
        return;
      }
      if (this.content.phonenum === '') {
        this.$toast.fail('手机号');
        return;
      }
      updateStudentDetail(updateobj)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

            return;
          }
          var obj = {
            id: this.$route.query.studentid
          };
          getStudent(obj)
            .then(result => {
              if (result.status !== 200) {
                this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

                return;
              }
              // console.log(result);
              var res = result.data[0];
              this.name = res.studentname;
              this.classnum = res.bugclassnum;
              this.phonenum = res.phonenum;
              this.remarks = res.remarks;
              this.giveclass = res.giveclass;
              this.foldleadnew = res.foldleadnew;
              var cobj = {
                id: res.belong_class_id
              };
              getClass(cobj)
                .then(result => {
                  if (result.status !== 200) {
                    this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

                    return;
                  }
                  // console.log(result);
                  this.belongclass = result.data[0].classname;
                  this.belongclassid = result.data[0].classid;

                  var valuestr =
                    '更新学员信息，id：' +
                    this.$route.query.studentid +
                    ';姓名：' +
                    updateobj.studentname +
                    ';手机号：' +
                    updateobj.phonenum +
                    ';备注：' +
                    updateobj.remarks +
                    ';班级：' +
                    this.belongclass +
                    ';时间：' +
                    this.getLocalTime(Date.parse(new Date()));

                  let handletype = {
                    type: 'updatestudentcontent',
                    value: valuestr
                  };
                  handleHistory(handletype)
                    .then(result => {
                      if (result.status !== 200) {
                        this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                        return;
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    delGiveClass() {
      this.dialogGiveClass = true;
      this.usegive = '';
    },
    addCourse() {
      this.dialogAddClass = true;
      this.add.classnum = '';
      this.add.giveclassnum = '';
    },
    updateStudentContent() {
      this.dialogUpdateStudentContent = true;
      getClassList()
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

            return;
          }
          var reslist = result.data;
          reslist.forEach((item, i) => {
            let obj = {};
            obj.text = item.classname;
            obj.value = item.classid;
            this.classList.push(obj);
          });
          this.content.studentname = JSON.parse(JSON.stringify(this.name));
          this.content.phonenum = JSON.parse(JSON.stringify(this.phonenum));
          this.content.remarks = JSON.parse(JSON.stringify(this.remarks));
          this.content.belongclass = JSON.parse(JSON.stringify(this.belongclass));
          this.content.belongclassid = JSON.parse(JSON.stringify(this.belongclassid));
        })
        .catch(error => {
          console.log(error);
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    showGood(item) {
      this.setGood(item);
      this.$router.push('/Good');
    },
    getType(val) {
      if (val.coursetype === 'giveclass') {
        return '赠送课时';
      }
      if (val.coursetype === 'class') {
        return '购买课时';
      }
    },
    getLocalTime(nS) {
      console.log(nS);
      return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
    },
    getCourseBeforeAndAfter(val) {
      if (val.coursenum <= 0) {
        if (val.coursebefore) {
          let beforecoursestr = '销课前课时：' + val.coursebefore;
          return beforecoursestr;
        }
      } else {
        if (val.coursebefore) {
          let beforecoursestr = '销课前课时：' + val.coursebefore;
          var morenum = parseInt(val.coursebefore) - parseInt(val.coursenum);
          let aftercoursestr = '，剩余课时：' + morenum;

          return beforecoursestr + aftercoursestr;
        }
      }
    },
    ...mapMutations({
      setGood: 'SET_GOOD_MUTATION'
    })
  }
};
</script>

<style lang="stylus" scoped>
.home
  background-color #eee
  margin-bottom 50px

.home-swipe
  box-sizing border-box
  padding 4px 6px
  background-color #fff
  border-bottom 1px solid #dedede

  .home-swipe-head
    padding 4px 0

    .recommend
      font-weight 700

    .tips
      font-size 12px
      margin-left 6px
      color #8f8f8f

    .swipe-num
      float right

      .indexPage
        font-weight 700

      .pageNum
        font-size 12px
        color #8f8f8f

  .swipe
    img
      width 100%

.scroll-hot
  width 100%
  overflow hidden

  .scroll-item
    display inline-block

.sale-ul
  display flex

  .sale-item
    flex-grow 1
    padding 2px 4px

    img
      width 100%

    .sale-title
      text-align center
      font-size 14px

      .sale-price
        color #ff4c0a
        font-size 16px

.discover-ul
  display flex
  height 100px
  margin-bottom 4px

  .discover-img
    width 100px

  .discover-li
    flex-grow 1
    margin-right 4px

    &:last-child
      margin-right 0

.recommend-title
  display flex
  justify-content center
  align-items center
  text-align center
  font-size 14px
  height 30px

  .border
    width 12px
    height 1px
    margin 0 8px
    background-color #000
</style>
