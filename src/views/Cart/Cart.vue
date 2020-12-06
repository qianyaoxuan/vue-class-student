<template>
  <div class="cart">
    <van-nav-bar title="班级"
      right-text="添加"
      @click-right="toAddClass"
      :z-index="10"
      fixed />
    <div class="nogood"
      v-if="!this.classList.length">
      <div>还没有班级信息，快去添加吧~</div>
      <van-button type="primary"
        class="btn"
        @click="toAddClass">去添加</van-button>
    </div>
<div  class='card-classs'>
<!-- <van-contact-card
  v-for='value in classList'
  type="edit"
 
  :key='value'
  :name="value.classid"
  :tel="value.classname"
  @click="onEdit"
/> -->
<van-cell   v-for='value in classList' :key="value.classname" :title="value.classname"  is-link  @click='toUpdateClass(value)'/>

</div>

    <van-checkbox-group class="card-goods"
      v-model="checkedGoods">
      <van-checkbox class="card-goods__item"
        v-for="item in cartList"
        :key="item.Goodid"
        :name="item.Goodid">
        <van-card :title="item.Goodname"
          :desc="item.Gooddescribe"
          :num="item.Cartcount"
          :price="formatPrice(item.GoodPriceaftersale)"
          :thumb="item.GoodImg">
          <div slot="footer"
            class="footer">
            <span class="add"
              @click.stop="reduceCount(item,item.Cartcount)">
              <van-button class="btn"
                size="mini">-</van-button>
            </span>
            <span class="input"
              @click.stop="showModal(item)">
              <span class="input-edit">{{item.Cartcount}}</span>
            </span>
            <span class="reduce"
              @click.stop="addCount(item,item.Cartcount)">
              <van-button class="btn"
                size="mini">+</van-button>
            </span>
          </div>
        </van-card>
      </van-checkbox>
    </van-checkbox-group>
    <van-dialog v-model="modalShow"
      show-cancel-button
      @confirm='addSubmit'
      title="添加班级">
        <van-field v-model="classname" placeholder="请输入班级名称" />
    </van-dialog>
    <van-dialog v-model="updateShow"
      show-cancel-button
      @confirm='updateSubmit'
      title="修改班级名称">
        <van-field v-model="update.updatename" placeholder="请输入班级名称" />
    </van-dialog>
    <van-submit-bar class="cart-bar"
      v-if="this.cartList.length"
      :price="isEdit?undefined:totalPrice"
      :label="isEdit?'':'合计'"
      :button-text="isEdit?'删除':'提交订单'"
      @submit="onSubmit">
      <span @click="selectAll"
        class="selectAll">
        <van-checkbox v-model="checkedAll">{{checkedAllMsg}}</van-checkbox>
      </span>
    </van-submit-bar>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import { mapGetters, mapMutations } from 'vuex';
import { addClass, handleHistory, getClassList, updateClass, updateCartCount, delFromCart } from '@/api/api';
export default {
  name: 'Cart',
  data() {
    return {
      cartList: [],
      classList: [],
      checkedGoods: [],
      checkedAll: false,
      checkedAllMsg: '全选',
      isEdit: false,
      modalShow: false,
      updateShow: false,
      editGood: {},
      classname: '',
      originname: '',
      update: {
        updateid: '',
        updatename: ''
      },
      editNum: 0,
      currentContact: {
        name: '张三',
        tel: '13000000000'
      },
      timer: 0
    };
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      // getCart()
      //   .then(result => {
      //     this.cartList = result.data;
      //     this.checkedGoods = [];
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
      getClassList()
        .then(result => {
          console.log(result);
          this.classList = result.data;
          // this.checkedGoods = [];
        })
        .catch(error => {
          console.log(error);
        });
    },
    onEdit() {},
    toAddClass() {
      this.classname = '';
      this.modalShow = true;
      // this.isEdit = !this.isEdit;
    },
    toUpdateClass(val) {
      this.update.updatename = val.classname;
      this.update.updateid = val.classid;
      this.originname = val.classname;
      this.updateShow = true;
    },
    reduceCount(item, count) {
      if (!count && count !== 0) {
        Toast({
          position: 'bottom',
          message: '数值不正确~'
        });
        return;
      }
      if (count <= 1) {
        Toast({
          position: 'bottom',
          message: '不能再少了~'
        });
        return;
      }
      count--;
      item.Cartcount = count;
      this.updateCartCountFun(item.Goodid, count);
    },
    addCount(item, count) {
      if (!count && count !== 0) {
        Toast({
          position: 'bottom',
          message: '数值不正确~'
        });
        return;
      }
      if (count >= item.Goodcount) {
        Toast({
          position: 'bottom',
          message: '只有这么多了~'
        });
        return;
      }
      count++;
      item.Cartcount = count;
      this.updateCartCountFun(item.Goodid, count);
    },
    reduceEditCount() {
      if (!this.editNum && this.editNum !== 0) {
        Toast({
          position: 'bottom',
          message: '数值不正确~'
        });
        return;
      }
      if (this.editNum <= 1) {
        Toast({
          position: 'bottom',
          message: '不能再少了~'
        });
        return;
      }
      this.editNum--;
    },
    addEditCount() {
      if (!this.editNum && this.editNum !== 0) {
        Toast({
          position: 'bottom',
          message: '数值不正确~'
        });
        return;
      }
      if (this.editNum >= this.editGood.Goodcount) {
        Toast({
          position: 'bottom',
          message: '只有这么多了~'
        });
        return;
      }
      this.editNum++;
    },
    showModal(item) {
      this.modalShow = true;
      this.editGood = item;
      let count = item.Cartcount;
      this.editNum = count;
    },
    goHome() {
      this.$router.push('/');
    },

    addSubmit() {
      var obj = {
        classname: this.classname
      };
      addClass(obj)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

            return;
          }
          this.$toast.success('添加成功~');
          var valuestr = '添加新班级，名称：' + this.classname;
          let handletype = {
            type: 'addclass',
            value: valuestr
          };

          handleHistory(handletype)
            .then(result => {
              if (result.status !== 200) {
                this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                return;
              }
              getClassList()
                .then(result => {
                  console.log(result);
                  this.classList = result.data;
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
    updateSubmit() {
      console.log(this.update);

      updateClass(this.update)
        .then(result => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
            return;
          }
          // console.log(result);
          this.$toast.success('更新成功~');
          var valuestr =
            '更新班级名称，id:' +
            this.update.updateid +
            ';原名称：' +
            this.originname +
            ';新名称：' +
            this.update.updatename;
          let handletype = {
            type: 'addclass',
            value: valuestr
          };
          handleHistory(handletype).then(result => {
            if (result.status !== 200) {
              this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
              return;
            }
            getClassList()
              .then(result => {
                console.log(result);
                this.classList = result.data;
              })
              .catch(error => {
                console.log(error);
              });
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        if (!this.editNum) {
          Toast({
            position: 'bottom',
            message: '数值不正确~'
          });
          done(false);
          return;
        }
        if (this.editNum > this.editGood.Goodcount) {
          Toast({
            position: 'bottom',
            message: '库存不够了~'
          });
          done(false);
          return;
        }
        if (this.editNum < 1) {
          Toast({
            position: 'bottom',
            message: '数量太少了~'
          });
          done(false);
          return;
        }
        this.editGood.Cartcount = this.editNum;
        this.updateCartCountFun(this.editGood.Goodid, this.editNum);
        done();
      } else {
        done();
      }
    },
    formatPrice(price) {
      return price.toFixed(2);
    },
    selectAll() {
      if (this.checkedAll) {
        for (let i = 0; i < this.cartList.length; i++) {
          this.checkedGoods.push(this.cartList[i].Goodid);
        }
        this.checkedAllMsg = '全不选';
      } else {
        this.checkedGoods = [];
        this.checkedAllMsg = '全选';
      }
    },
    updateCartCountFun(id, count) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        updateCartCount({ id: id, num: count })
          .then(result => {
            console.log(result);
          })
          .catch(error => {
            console.log(error);
          });
      }, 500);
    },
    onSubmit() {
      if (this.isEdit) {
        if (!this.checkedGoods.length) {
          Toast({
            position: 'bottom',
            message: '没有选择物品~'
          });
          return;
        }
        Dialog.confirm({
          title: '警告',
          message: '确实要删除吗?'
        }).then(() => {
          var params = {
            delId: this.checkedGoods
          };
          delFromCart(params)
            .then(result => {
              console.log(result);
              this.$toast.success('删除成功');
              this.init();
            })
            .catch(error => {
              console.log(error);
            });
        });
      } else {
        if (!this.checkedGoods.length) {
          Toast({
            position: 'bottom',
            message: '没有选择物品~'
          });
          return;
        }
        var orderGood = this.cartList.filter(item => {
          if (this.checkedGoods.indexOf(item.Goodid) !== -1) {
            return item;
          }
        });
        this.setOrderGood(orderGood);
        this.$router.push('/Order');
      }
    },
    ...mapMutations({
      setOrderGood: 'SET_ORDERGOOD_MUTATION'
    })
  },
  computed: {
    totalPrice() {
      let all = 0;
      this.cartList.forEach(item => {
        all += this.checkedGoods.indexOf(item.Goodid) !== -1 ? item.GoodPrice * item.Cartcount : 0;
      });
      return all * 100;
    },
    rightText() {
      if (this.cartList.length) {
        return this.isEdit ? '完成' : '编辑';
      } else {
        return '';
      }
    }
  },
  watch: {
    checkedGoods() {
      if (this.checkedGoods.length === this.cartList.length) {
        this.checkedAll = true;
        this.checkedAllMsg = '全不选';
      }
      if (this.checkedGoods.length < this.cartList.length) {
        this.checkedAll = false;
        this.checkedAllMsg = '全选';
      }
    }
  }
};
</script>

<style lang="stylus">
.cart
  margin-bottom 120px

.card-classs
  padding-top 46px
  background-color #fff

.card-goods
  padding-top 46px
  padding-bottom 0
  background-color #fff

  .card-goods__item
    position relative
    background-color #fafafa
    border-bottom 1px solid #e5e5e5

    .van-checkbox__label
      width 100%
      padding 0 10px 0 15px
      box-sizing border-box

    .van-checkbox__icon
      top 50%
      left 10px
      z-index 1
      margin-top -10px
      position absolute

    .van-card__price
      color #f44

.modal-box
  margin 20px 0

.footer, .modal-box
  display flex
  justify-content center
  align-items center

  input
    outline 0
    border 0
    width 50px
    text-align center
    border-bottom 1px solid #f6b539
    margin 0 6px

  .input
    .input-edit
      padding 0 10px
      font-size 14px
      text-align center
      background-color #fafafa
      border-bottom 1px solid #f6b539
      margin 0 6px

  .btn
    width 30px
    margin 0

.nogood
  position absolute
  width 220px
  text-align center
  color #666
  left 50%
  top 50%
  transform translate(-50%, -50%)

  .btn
    margin-top 16px

.selectAll
  margin-left 10px

.cart-bar
  bottom 50px
</style>
