<template>
  <div class="home">
            <van-nav-bar
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
      <van-dropdown-menu>
  <van-dropdown-item v-model="class1" :options="classList" />
</van-dropdown-menu>
<van-field v-model="text" label="姓名" />
<!-- 输入手机号，调起手机号键盘 -->
<van-field v-model="tel" type="tel" label="手机号" />
<van-field v-model="price" type="number" label="收费" />
<van-field v-model="digit" type="number" label="课时" />
<van-field v-model="givedigit" type="number" label="赠送课时" />
<van-datetime-picker
  v-model="createdate"
  type="date"
  title="选择报名日期"
  :min-date="minDate"
  :max-date="maxDate"
/>
<van-field v-model="remarks"  label="备注" />
<van-cell center title="是否老带新">
  <template #right-icon>
    <van-switch v-model="checked" size="24" />
  </template>
</van-cell>
<div v-if='checked'>
    <van-search  v-model="searchValue" placeholder="请输入老学员姓名" show-action @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
<van-cell-group>
  <van-cell title="姓名" :value="old.name" />
  <van-cell title="所属班级" :value="old.class" />
  <van-cell title="购买课时" :value="old.classnum" />
  <van-cell title="已赠送课时" :value="old.giveclass" />
</van-cell-group>
<van-field v-model="oldgiveclass" type="digit" label="本次赠送课时" />
</div>
<van-button type="primary" size="large" @click='addNewstudent'>添加</van-button>
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
  getClassList,
  addStudent,
  updateStudentgiveclass,
  searchStudent,
  handleHistory,
  discover,
  getStudentCourse
} from '@/api/api';
import { mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      searchValue: '',
      indexPage: 1,
      hotGoods: [],
      text: '',
      class1: '',
      tel: '',
      digit: '',
      givedigit: '',
      remarks: '',
      oldgiveclass: '',
      origingiveclass: '',
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2025, 10, 1),
      old: {
        name: '空',
        classname: '',
        classnum: '',
        giveclass: '',
        studentid:''
      },
      checked: false,
      price: '',
      createdate: '',
      saleGroupGoods: [],
      discoverGoods: [],
      classList: []
    };
  },
  mounted() {
    getClassList()
      .then(result => {
        if (result.status !== 200) {
          this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

          return;
        }
        console.log(result);
        var reslist = result.data;
        reslist.forEach((item, i) => {
          let obj = {};
          obj.text = item.classname;
          obj.value = item.classid;
          this.classList.push(obj);
        });
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
    onSearch() {
      // console.log('onSearch');
      let obj = {
        name: this.searchValue
      };
      searchStudent(obj)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

            return;
          }
          // console.log(result);
          var res = result.data;
          if (res.length) {
            this.old.name = res[0].studentname;
            this.old.class = res[0].classname;
            this.old.studentid =  res[0].studentid;
           var sobj = {
              studentid:  res[0].studentid,
            };

            getStudentCourse(sobj)
              .then((result) => {
                if (result.status !== 200) {
                  this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                  return;
                }
                var classnum = 0;
                var giveclassnum = 0;
                var price = 0;
                for (var i in result.data) {
                  classnum += parseFloat(result.data[i].bugclassnumfree);
                  giveclassnum += parseFloat(result.data[i].giveclassfree);
                  price += parseFloat(result.data[i].price);
                }
                this.old.classnum = classnum;
                 this.old.giveclass = giveclassnum;
                // this.price = price;
                // this.addcourseHistoryList = result.data;
              })
          } else {
            this.old.name = '无';
            this.old.class = '无';
            this.old.classnum = '无';
            this.old.giveclass = '无';
          }
          // this.$toast.success('更新成功~');
        })
        .catch(error => {
          console.log(error);
        });
    },
    addNewstudent() {
      var createtime = this.createdate.getTime() + '';
      let sobj = {
        name: this.text,
        phonenum: this.tel,
        // price: this.price,
        // classnum: this.digit,
        // giveclass: this.givedigit,
        createdate: createtime,
        remarks: this.remarks,
        belong_class_id: this.class1
      };
      // if (parseFloat(this.digit) < 0 || parseFloat(this.givedigit) < 0) {
      //   this.$toast.fail('课时数量不正确');
      //   return;
      // }
      if (this.class1 === '') {
        this.$toast.fail('请选择班级');
        return;
      }
      if (this.text === '') {
        this.$toast.fail('请输入学员姓名');
        return;
      }
      if (this.tel === '') {
        this.$toast.fail('请输入手机号码');
        return;
      }
      // if (this.digit === '') {
      //   this.$toast.fail('请输入课时');
      //   return;
      // }
      searchStudent(sobj)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

            return;
          }
          var res = result.data;
          if (res.length) {
            this.$toast.fail('学员名重复');
            return;
          } else {
            if (this.checked) {
              //老带新
              // if (this.old.name === '空' || this.old.name === '无' || this.old.name === '') {
              //   this.$toast.fail('请检查老学员信息');
              //   return;
              // }
              // if (this.oldgiveclass === '') {
              //   this.$toast.fail('老学员赠送课时不能为空');
              //   return;
              // }
              sobj.foldleadnew = 1;
            } else {
              //不是老带新
              sobj.foldleadnew = 0;
            }
            addStudent(sobj)
              .then(result => {
                if (result.status !== 200) {
                  this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                  return;
                }
                this.$toast.success('学员添加成功~');
                let tobj={
                  name:this.text
                }
      searchStudent(tobj)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

            return;
          }}
        )
                this.text = '';
                this.tel = '';
                this.digit = '';
                this.givedigit = '';
                this.remarks = '';
                this.oldgiveclass = '';
                this.checked = false;
                this.searchValue = '';
                this.old = {
                  name: '空',
                  classname: '',
                  classnum: '',
                  giveclass: ''
                };





                // var flodstr = '';
                // if (sobj.foldleadnew === 1) {
                //   flodstr = '是';
                // } else if (sobj.foldleadnew === 0) {
                //   flodstr = '否';
                // } else {
                //   flodstr = sobj.foldleadnew;
                // }
                // var valuestr =
                //   '添加新学学员,姓名：' +
                //   sobj.name +
                //   ';手机号：' +
                //   sobj.phonenum +
                //   ';班级：' +
                //   sobj.belong_class_id +
                //   ';购买课程：' +
                //   sobj.classnum +
                //   ';赠送课程：' +
                //   sobj.giveclass +
                //   ';是否老带新：' +
                //   flodstr +
                //   ';备注：' +
                //   sobj.remarks;
                // this.$toast.success('学员添加成功~');
                // let handletype = {
                //   type: 'addstudent',
                //   value: valuestr
                // };
                
                // handleHistory(handletype)
                //   .then(result => {
                //     if (result.status !== 200) {
                //       this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                //       return;
                //     }
                //   })
                // if (this.checked) {
                //   var totaloldgive = parseFloat(this.old.giveclass) + parseFloat(this.oldgiveclass);
                //   this.origingiveclass = this.oldgiveclass;
                //   let oldobj = {
                //     name: this.old.name,
                //     giveclass: totaloldgive
                //   };
                //   updateStudentgiveclass(oldobj)
                //     .then(result => {
                //       if (result.status !== 200) {
                //         this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                //         return;
                //       }
                //       this.text = '';
                //       this.tel = '';
                //       this.digit = '';
                //       this.givedigit = '';
                //       this.remarks = '';
                //       this.oldgiveclass = '';
                //       this.searchValue = '';
                //       this.checked = false;
                //       this.old = {
                //         name: '空',
                //         classname: '',
                //         classnum: '',
                //         giveclass: ''
                //       };
                //       var flodstr = '';
                //       if (sobj.foldleadnew === 1) {
                //         flodstr = '是';
                //       } else if (sobj.foldleadnew === 0) {
                //         flodstr = '否';
                //       } else {
                //         flodstr = sobj.foldleadnew;
                //       }
                //       var valuestr =
                //         '添加新学学员,姓名：' +
                //         sobj.name +
                //         ';手机号：' +
                //         sobj.phonenum +
                //         ';班级：' +
                //         sobj.belong_class_id +
                //         ';购买课程：' +
                //         sobj.classnum +
                //         ';赠送课程：' +
                //         sobj.giveclass +
                //         ';是否老带新：' +
                //         flodstr +
                //         ';备注：' +
                //         ';老学员姓名：' +
                //         oldobj.name +
                //         ';老员工赠课：' +
                //         this.origingiveclass;
                //       this.$toast.success('学员添加成功~');
                //       let handletype = {
                //         type: 'addstudent',
                //         value: valuestr
                //       };
                //       handleHistory(handletype)
                //         .then(result => {
                //           if (result.status !== 200) {
                //             this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                //             return;
                //           }
                //           var oldstr =
                //             '老带新赠课：新学员姓名' +
                //             sobj.name +
                //             ';老学员姓名：' +
                //             oldobj.name +
                //             ';老员工赠课：' +
                //             this.origingiveclass;
                //           this.$toast.success('学员添加成功~');
                //           let oldstudenttype = {
                //             type: 'updategiveclass',
                //             value: oldstr
                //           };
                //           handleHistory(oldstudenttype)
                //             .then(result => {
                //               if (result.status !== 200) {
                //                 this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                //                 return;
                //               }
                //             })
                //             .catch(error => {
                //               console.log(error);
                //             });
                //         })
                //         .catch(error => {
                //           console.log(error);
                //         });
                //     })
                //     .catch(error => {
                //       console.log(error);
                //     });
                // } else {
                //   this.$toast.success('学员添加成功~');
                //   this.text = '';
                //   this.tel = '';
                //   this.digit = '';
                //   this.givedigit = '';
                //   this.remarks = '';
                //   this.oldgiveclass = '';
                //   this.checked = false;
                //   this.searchValue = '';
                //   this.old = {
                //     name: '空',
                //     classname: '',
                //     classnum: '',
                //     giveclass: ''
                //   };
                //   var flodstr = '';
                //   if (sobj.foldleadnew === 1) {
                //     flodstr = '是';
                //   } else if (sobj.foldleadnew === 0) {
                //     flodstr = '否';
                //   } else {
                //     flodstr = sobj.foldleadnew;
                //   }
                //   var valuestr =
                //     '添加新学学员,姓名：' +
                //     sobj.name +
                //     ';手机号：' +
                //     sobj.phonenum +
                //     ';班级：' +
                //     sobj.belong_class_id +
                //     ';购买课程：' +
                //     sobj.classnum +
                //     ';赠送课程：' +
                //     sobj.giveclass +
                //     ';是否老带新：' +
                //     flodstr +
                //     ';备注：' +
                //     sobj.remarks;
                //   this.$toast.success('学员添加成功~');
                //   let handletype = {
                //     type: 'addstudent',
                //     value: valuestr
                //   };
                //   handleHistory(handletype)
                //     .then(result => {
                //       if (result.status !== 200) {
                //         this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                //         return;
                //       }
                //     })
                //     .catch(error => {
                //       console.log(error);
                //     });
                // }
              })
          }
          // this.$toast.success('更新成功~');
        })
        .catch(error => {
          console.log(error);
        });
    },
    onClickLeft() {
      this.$router.push('/');
    },
    addSubmit() {},
    changeSwipe(index) {
      this.indexPage = index;
    },
    showGood(item) {
      this.setGood(item);
      this.$router.push('/Good');
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
