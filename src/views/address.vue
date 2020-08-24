<template>
  <div class='address-edit'>
    <div class='eidt-box'>
      <h4>收货地址</h4>
      <ul class='eidt-list'>
        <li>
          <span class="iconfont iconshouhuoren"></span>
          <input v-model='addressFrom.userName' type='text' placeholder='收货人姓名'>
        </li>
        <li>
          <span class="iconfont icondianhua"></span>
          <input v-model='addressFrom.userPhone' type='number' placeholder='收货人电话'>
        </li>
        <li @click='cityareaflag = true'>
          <span class="iconfont iconshengshiqu"></span>
          <span v-if='addressFrom.userProvice.length' class='city-span'>{{ addressFrom.userProvice | cityFilter }}</span>
          <input v-else type='text' readonly placeholder='省/市/区'>
          <span> &gt; </span>
        </li>
        <li>
          <span class="iconfont iconjiedao"></span>
          <input v-model='addressFrom.userStreet' type='text' placeholder='街道、单元、门牌号等'>
        </li>
      </ul>
    </div>

    <city-area-list
      :choosed-city='addressFrom.userProvice'
      :choosed-index='choosedIndex'
      :city-list-data='cityListData'
      :has-city-data='hasCityData'
      :city-area-flag='cityareaflag'
      @city-picker-close='cityareaflag = false'
      @change-city-name='changeCityName'
      @click-city-list='clickCityList'
    />
  </div>
</template>

<script>
import cityAreaList from '@/components/cityarea-picker'
export default {
  name: 'AddressEdit',
  components: { cityAreaList },
  data () {
    return {
      // 节流开关
      clickFlag: true,
      // 当前选中项索引值
      choosedIndex: 0,
      // 显示请选择开关
      hasCityData: false,
      // 组件开关
      cityareaflag: false,
      // 存放获取省市区list
      cityListData: [],
      // 表单form
      addressFrom: {
        userName: '',
        userPhone: '',
        userProvice: [],  // 存放选择省市区的itemobj
        userStreet: '',
        swithFlag: false
      }
    }
  },
  mounted () {
    this.checkProvicePick()
  },
  methods: {
    // 获取省份
    async checkProvicePick () {
      const res = await this.$get(this.$url.provice.allCity)
      const { code, message, object: data } = res.data
      if (code === 200 && data.length > 0) {
        this.hasCityData = true
        this.cityListData = data
      } else {
        this.$toast(message)
      }
    },

    // 获取下级市区，通过上一级code码查询下级list
    async checkCityPick (cityCode) {
      const res = await this.$get(this.$url.provice.childCity, { parentCode: cityCode })
      const { code, object: data } = res.data
      if (code === 200 && data.length > 0) {
        this.hasCityData = true
        this.cityListData = data
      } else {
        this.hasCityData = false
        this.cityareaflag = false
        this.choosedIndex = this.addressFrom.userProvice.length - 1
      }
    },

    // 选择省市区list
    clickCityList (city) {
      if (!this.clickFlag) { return false }
      this.clickFlag = false
      const prolist = this.cityListData
      // 添加选中项标记
      prolist.map(item => {
        item.active = false
        if (item.code === city.code) { item.active = true }
      })
      this.addressFrom.userProvice.push(city)
      this.checkCityPick(city.code)
      setTimeout(() => { this.clickFlag = true }, 800)
    },

    // 选择已选城市名称
    changeCityName (item, index) {
      if (!this.clickFlag) { return false }
      this.clickFlag = false
      this.choosedIndex = index
      // 点击已选项，重置当前及以后的所有选择项
      let len = this.addressFrom.userProvice.length
      while (len--) {
        if (len >= index) {
          this.addressFrom.userProvice.splice(len, 1)
        }
      }
      setTimeout(() => { this.clickFlag = true }, 600)
      index === 0 ? this.checkProvicePick() : this.checkCityPick(item.parentCode)
    }
  },
  filters: {
    // 过滤对应的中文name
    cityFilter (name) {
      let cityName = ''
      name.map(item => { cityName += item.name })
      return cityName
    }
  }
}
</script>

<style scoped lang='stylus'>
.address-edit
  min-height 100vh
  padding 20px 12px 0
  box-sizing border-box
  background-color #f3f3f3
  .eidt-box h4,.eidt-box .eidt-list,.edit-sure
    box-sizing border-box
    background-color #fff
  .eidt-box
    h4
      font-size 16px
      padding 15px 20px
      border-top-left-radius 6px
      border-top-right-radius 6px
      border-bottom 1px solid #ddd
    .eidt-list
      padding 0 20px
      border-bottom-left-radius 6px
      border-bottom-right-radius 6px
      li
        display flex
        flex-flow row nowrap
        align-items center
        font-size 14px
        padding 15px 0
        color #999999
        border-bottom 1px solid #ddd
        &:last-child
          border-bottom none
        input[type='text'],input[type='number'],.city-span
          flex 2
          color #282828
          padding 0 20px
        .city-span
          line-height 18px
  .edit-sure
    padding 18px 12px
    border-radius 6px
</style>
