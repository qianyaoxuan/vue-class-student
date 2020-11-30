<template>
  <div>
   <!-- <van-button type="primary" size="large" @click='quit'>退出</van-button> -->
  </div>
</template>

<script>
export default {
  name: 'User',
  methods: {
    quit() {}
  }
};
</script>

<style lang="stylus" scoped>
.user-poster
  width 100%
  height auto
  display block

.user-link
  text-align center
  font-size 12px
  padding 15px 0
  background-color #fff

  .van-icon
    display block
    margin-bottom 4px
    font-size 24px

.user-group
  margin-bottom 0.3rem
</style>
