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

    <van-button type="primary" size="large" @click="checkList">查询报表</van-button>
    <div class="title-class">
      整体收费金额显示
      <div>
        <van-cell title="添加课时收费" :value="add.price" />
        <van-cell title="购买课时添加数量" :value="add.num" />
        <van-cell title="赠送课时添加数量" :value="add.givenum" />
        <van-cell title="添加课时总数量" :value="add.totalnum" />
      </div>
    </div>

    <div class="title-class">
      整体消课统计
      <div>
        <van-cell title="消耗金额" :value="price" />
        <van-cell title="购买课时消耗" :value="num" />
        <van-cell title="赠送课时消耗" :value="givenum" />
        <van-cell title="合计消耗课时" :value="totalnum" />
      </div>
    </div>
  </div>
</template>

<script>
import { getReport, getReportAddClass } from '@/api/api';

export default {
  data() {
    return {
      valuestart: '',
      valueend: '',
      showPickerStart: false,
      showPickerEnd: false,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2025, 10, 1),
      num: 0,
      givenum: 0,
      totalnum: 0,
      price: 0,
      add: {
        num: 0,
        givenum: 0,
        totalnum: 0,
        price: 0,
      },
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
    checkList() {
      console.log(this.valuestart.getTime() + '');
      console.log(this.valueend.getTime() + '');

      var dobj = {
        datestart: this.valuestart.getTime() + '',
        dateend: this.valueend.getTime() + '',
      };
      console.log(dobj);
      getReport(dobj)
        .then((result) => {
          if (result.status !== 200) {
            this.$toast.fail('请联系研发' + JSON.stringify(result.msg));

            return;
          }
          this.num = 0;
          this.price = 0;
          // console.log(result);
          var res = result.data;
          var coursenu = 0;
          var givenu = 0;
          var courseprice = 0;
          res.forEach((item, i) => {
            if (item.coursetype === 'class') {
              coursenu += parseFloat(item.coursenum);
              courseprice += parseFloat(item.classesprice);
            }
            if (item.coursetype === 'giveclass') {
              givenu += parseFloat(item.coursenum);
            }
          });
          this.num = coursenu;
          this.givenum = givenu;
          this.price = Math.floor(courseprice * 100) / 100;
          this.totalnum = coursenu + givenu;

          getReportAddClass(dobj)
            .then((result) => {
              if (result.status !== 200) {
                this.$toast.fail('请联系研发' + JSON.stringify(result.msg));
                return;
              }

          this.add.num = 0;
          this.add.price = 0;
          // console.log(result);
          var addres = result.data;
          var addcoursenu = 0;
          var addgivenu = 0;
          var addcourseprice = 0;
            addres.forEach((item, i) => {
              addcoursenu += parseFloat(item.bugclassnum);
              addgivenu += parseFloat(item.giveclass);
              addcourseprice += parseFloat(item.price);
          });

            this.add.num = addcoursenu;
          this.add.givenum = addgivenu;
          this.add.price = Math.floor(addcourseprice * 100) / 100;
          this.add.totalnum = addcoursenu + addgivenu;

            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.user-poster {
  width: 100%;
  height: auto;
  display: block;
}

.user-link {
  text-align: center;
  font-size: 12px;
  padding: 15px 0;
  background-color: #fff;

  .van-icon {
    display: block;
    margin-bottom: 4px;
    font-size: 24px;
  }
}

.user-group {
  margin-bottom: 0.3rem;
}

.title-class {
  text-align: left;
  margin: 30px 0 10px;
}
</style>
