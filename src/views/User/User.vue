<template>
  <div>
    <van-field
  readonly
  clickable
  name="datetimePicker"
  :value="valuestart"
  label="起始时间"
  placeholder="点击选择时间"
  @click="showPickerStart = true"
/>
<van-popup v-model="showPickerStart" position="bottom">
  <van-datetime-picker
    type="date"
    @confirm="onConfirm"
    @cancel="showPickerStart = false"
    :min-date="minDate"
  :max-date="maxDate"
  />
</van-popup>



   <van-field
  readonly
  clickable
  name="datetimePicker"
  :value="valueend"
  label="结束时间"
  placeholder="点击选择时间"
  @click="showPickerEnd = true"
/>
<van-popup v-model="showPickerEnd" position="bottom">
  <van-datetime-picker
    type="date"
    @confirm="onConfirmEnd"
    @cancel="showPickerEnd = false"
    :min-date="minDate"
  :max-date="maxDate"
  />
</van-popup>

<van-button type="primary" size="large"  @click='checkList'>查询报表</van-button>

  
   </div>
</template>

<script>
import {
getReport
} from '@/api/api';

export default {
   data() {
    return {
      valuestart: '',
      valueend:'',
      showPickerStart: false,
      showPickerEnd:false,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2025, 10, 1)
    };
  },
  name: 'User',
  methods: {
      onConfirm(time) {
      this.valuestart = time;
      this.showPickerStart = false;
    },
     onConfirmEnd(time) {
      this.valueend = time;
      this.showPickerEnd = false;
    },
    checkList(){
      console.log(this.valuestart.getTime()+'')
      console.log(this.valueend.getTime()+'')

  var dobj = {
      datestart: this.valuestart.getTime()+'',
      dateend:this.valueend.getTime()+''
    };
    console.log(dobj)
    getReport(dobj)
      .then(result => {
        if (result.status !== 200) {
          this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

          return;
        }
        // console.log(result);
        // this.delcourseHistoryList = result.data;
        // this.belongclass = result.data[0].classname;
      })
      .catch(error => {
        console.log(error);
      });
    }
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
