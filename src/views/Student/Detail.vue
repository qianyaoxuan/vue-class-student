<template>
  <div class="home">

        <van-nav-bar
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
<van-cell-group>
  <van-cell title="姓名" :value="name" />
  <van-cell title="所属班级" :value="belongclass" />
  <van-cell title="手机号" :value="phonenum" />
  <van-cell title="购买课时" is-link :value="classnum"  @click='delClass' />
  <van-cell title="已赠送课时"  is-link :value="giveclass" @click='delGiveClass'  />
  <van-cell  v-if='foldleadnew===1' title="是否老带新" value="是"  />
  <van-cell  v-else title="是否老带新" value="否"  />
</van-cell-group>

<van-dialog v-model="dialogClass" title="购买课时销课" show-cancel-button @confirm='delClassConfirm'>
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
<van-dialog v-model="dialogGiveClass" title="赠送课时销课" show-cancel-button @confirm='delGiveClassConfirm'>
      <van-cell title="剩余课时" :value="giveclass"   />
   <van-field v-model="usegive" label="本次销耗课时" />
    <van-datetime-picker
  v-model="dategive"
  type="date"
  title="选择年月日"
  :min-date="minDate"
  :max-date="maxDate"
/>
</van-dialog>
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
  addStudent,
  updateStudentgiveclass,
  updateStudentclass,
  getdelCourseHistory,
  delCourse,
  discover
} from '@/api/api';
import { mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      name: '',
      belongclass: '',
      classnum: '',
      phonenum: '',
      giveclass: '',
      foldleadnew: '',
      dialogGiveClass: false,
      dialogClass: false,
      use: '',
      date: '',
      usegive: '',
      dategive: '',
      delcourseHistoryList: [],
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2025, 10, 1)
    };
  },
  activated() {
    this.name = '';
    this.classnum = '';
    this.phonenum = '';
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
        this.giveclass = res.giveclass;
        this.foldleadnew = res.foldleadnew;
        let cobj = {
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
        console.log(result);
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
    addSubmit() {},
    delClass() {
      this.dialogClass = true;
      this.use = '';
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
          // console.log(this.date);
          // console.log(this.date.getTime());
          // var ddd = this.date.getTime();
          // console.log(Math.round(ddd / 1000));
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
          let delobj = {
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
