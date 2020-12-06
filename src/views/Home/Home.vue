<template>
  <div class="home">

    <van-search v-model="searchValue" placeholder="请输入学员姓名" show-action @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

 <van-button type="primary" size="small" to="/Student">录入学员</van-button>
<!-- <van-cell   v-for='value in studentList' :key="value.name" :title="value.name"  is-link  @click='toStudentDetail(value)'/> -->
    <van-grid :column-num="2">
  <van-grid-item v-for="(item,index) in classstudentList" :key="index" icon="photo-o" :text="getText(item)" @click='toClassDetail(item)' />
</van-grid>
  </div>
</template>

<script>
import goodItem from '@/components/goodItem/goodItem';
import scrollX from '@/components/scroll/scrollX';
import backgroundImg from '@/components/backgroundImg/backgroundImg';
import tabItem from '@/components/tabItem/tabItem';
import {
  hotSale,
  searchStudent,
  saleGroup,
  getClassList,
  getClassStudentlist,
  getStudentlist,
  discover
} from '@/api/api';
import { mapMutations } from 'vuex';
export default {
  name: 'Home',
  data() {
    return {
      searchValue: '',
      indexPage: 1,
      hotGoods: [],
      modalShow: false,
      text: '',
      class1: '',
      tel: '',
      digit: '',
      givedigit: '',
      checked: false,
      saleGroupGoods: [],
      discoverGoods: [],

      classList: [],
      studentList: [],
      classstudentList: []
    };
  },
  mounted() {
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
        // this.checkedGoods = [];
      })
      .catch(error => {
        console.log(error);
      });

    // getStudentlist()
    //   .then(result => {
    //     // console.log(result);
    //     var stulist = result.data;
    //     stulist.forEach((item, i) => {
    //       let obj = {};
    //       obj.name = item.studentname;
    //       obj.id = item.studentid;
    //       this.studentList.push(obj);
    //     });
    //     // this.checkedGoods = [];
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    getClassStudentlist()
      .then(result => {
        if (result.status !== 200) {
          this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
          return;
        }
        // console.log(result);
        var stulist = result.data;
        var tmp = [];
        stulist.forEach((item, i) => {
          let classindex = tmp.findIndex(t => t.classid === item.classid);
          if (classindex === -1) {
            if (item.studentid) {
              tmp.push({
                classid: item.classid,
                classname: item.classname,
                num: 1
              });
            } else {
              tmp.push({
                classid: item.classid,
                classname: item.classname,
                num: 0
              });
            }
          } else {
            if (item.studentid) {
              let n = tmp[classindex].num + 1;
              tmp[classindex].num = n;
            }
          }
        });
        console.log(tmp);
        this.classstudentList = tmp;
        // this.checkedGoods = [];
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

          var res = result.data;
          // console.log(result);
          if (res.length) {
            var sid = res[0].studentid;
            this.$router.push({
              path: '/StudentDetail',
              query: {
                studentid: sid
              }
            });
          } else {
            this.$toast.success('未查询到学员');
          }
          // this.$toast.success('更新成功~');
        })
        .catch(error => {
          console.log(error);
        });
    },
    addSubmit() {},
    addStudent() {
      this.modalShow = true;
    },
    toStudentDetail(val) {
      this.$router.push({
        path: '/StudentDetail',
        query: {
          studentid: val.id
        }
      });
    },
    toClassDetail(val) {
      this.$router.push({
        path: '/Class',
        query: {
          classid: val.classid
        }
      });
    },
    getText(val) {
      var str = '班级：' + val.classname + '; 人数：' + val.num;
      return str;
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
