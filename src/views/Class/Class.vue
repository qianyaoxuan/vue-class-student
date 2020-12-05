<template>
  <div class="home">

    <van-nav-bar
  :title="classname"
  left-text="返回"
  left-arrow
  @click-left="onClickLeft"
/>
    <van-cell   v-for='value in classList' :key="value.text" :title="value.text"  is-link @click='toStudentDetail(value)'  />

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
  getOneClassStudentlist,
  getClass,
  searchStudent,
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
      text: '',
      class1: '',
      tel: '',
      digit: '',
      givedigit: '',
      oldgiveclass: '',
      checked: false,
      saleGroupGoods: [],
      discoverGoods: [],
      classList: [],
      classname: ''
    };
  },
  activated() {
    this.classname = '';
    this.classList = [];
    var cid = this.$route.query.classid;
    let obj = {
      classid: cid
    };

    getOneClassStudentlist(obj)
      .then(result => {
        if (result.status !== 200) {
          this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

          return;
        }
        // console.log(result);
        var reslist = result.data;
        reslist.forEach((item, i) => {
          let obj = {};
          obj.text = item.studentname;
          obj.value = item.studentid;
          this.classList.push(obj);
        });
        let cobj = {
          id: cid
        };
        getClass(cobj)
          .then(result => {
            if (result.status !== 200) {
              this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

              return;
            }
            // console.log(result);
            this.classname = result.data[0].classname;
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  },
  mounted() {},
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
    toStudentDetail(val) {
      this.$router.push({
        path: '/StudentDetail',
        query: {
          studentid: val.value
        }
      });
    },
    onClickLeft() {
      this.$router.go(-1);
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
