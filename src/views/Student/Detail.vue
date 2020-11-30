<template>
  <div class="home">
<van-cell-group>
  <van-cell title="姓名" :value="name" />
  <van-cell title="所属班级" :value="belongclass" />
  <van-cell title="手机号" :value="phonenum" />
  <van-cell title="购买课时" is-link :value="classnum"  @click='delClass' />
  <van-cell title="已赠送课时"  is-link :value="giveclass" @click='delGiveClass'  />
  <van-cell title="是否老带新" :value="foldleadnew" />
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
<van-dialog v-model="dialogGiveClass" title="赠送课时销课" show-cancel-button>
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
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2025, 10, 1)
    };
  },
  mounted() {
    var sid = this.$route.query.studentid;
    let obj = {
      id: sid
    };
    getStudent(obj)
      .then(result => {
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
        console.log(cobj);
        getClass(cobj)
          .then(result => {
            console.log(result);
            this.belongclass = result.data[0].classname;
          })
          .catch(error => {
            console.log(error);
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
    addSubmit() {},
    delClass() {
      this.dialogClass = true;
    },
    delClassConfirm() {
      var freeclassnum = parseInt(this.classnum) - parseInt(this.use);
      let obj = {
        name: this.name,
        bugclassnum: freeclassnum
      };
      updateStudentclass(obj)
        .then(result => {
          // console.log(this.date);
          // console.log(this.date.getTime());
          // var ddd = this.date.getTime();
          // console.log(Math.round(ddd / 1000));
          var time = this.date.getTime() + '';
          let delobj = {
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
              var sid = this.$route.query.studentid;
              let obj = {
                id: sid
              };
              getStudent(obj)
                .then(result => {
                  var res = result.data[0];
                  this.classnum = res.bugclassnum;
                  this.giveclass = res.giveclass;
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
    },
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
