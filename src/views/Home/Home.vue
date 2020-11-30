<template>
  <div class="home">
    <van-search v-model="searchValue" placeholder="请输入学员姓名" show-action @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
 <van-button type="primary" size="small" to="/Student">录入学员</van-button>
<van-cell   v-for='value in studentList' :key="value.name" :title="value.name"  is-link  @click='toStudentDetail(value)'/>

  </div>
</template>

<script>
import goodItem from '@/components/goodItem/goodItem';
import scrollX from '@/components/scroll/scrollX';
import backgroundImg from '@/components/backgroundImg/backgroundImg';
import tabItem from '@/components/tabItem/tabItem';
import { hotSale, saleGroup, getClassList, getStudentlist, discover } from '@/api/api';
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
      studentList: []
    };
  },
  mounted() {
    getClassList()
      .then(result => {
        console.log(result);
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

    getStudentlist()
      .then(result => {
        // console.log(result);
        var stulist = result.data;
        stulist.forEach((item, i) => {
          let obj = {};
          obj.name = item.studentname;
          obj.id = item.studentid;
          this.studentList.push(obj);
        });
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
      console.log('onSearch');
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
