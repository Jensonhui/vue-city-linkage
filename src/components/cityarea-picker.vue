<template>
  <div>
    <transition name='fade'> <div v-if='cityAreaFlag' class='shadow'></div> </transition>
    <transition name='bottom'>
      <div class='city-list' v-if='cityAreaFlag'>
        <div class='list-top flex-row'>
          <h3>收货地址</h3>
          <span @click.stop='closeCityPicker'>x</span>
        </div>
        <div class='list-select'>
          <span
            :class="[!hasCityData && choosedIndex === index ? 'active' : '', 'city-select']"
            v-for='(item, index) in choosedCity'
            :key='index'
            @click='changeCityName(item,index)'
          >{{item.name}}</span>
          <span class='city-select active' v-show='hasCityData'>请选择</span>
        </div>
        <ul class='list-data'>
          <li
            :class="cityItem.active ? 'active': ''"
            v-for='cityItem in cityListData'
            :key='cityItem.code'
            @click="clickCityList(cityItem)"
          >{{cityItem.name}}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'cityArea',
  props: {
    cityAreaFlag: {
      type: Boolean,
      default: false
    },
    hasCityData: {
      type: Boolean,
      default: false
    },
    cityListData: {
      type: Array,
      default: null
    },
    choosedCity: {
      type: Array,
      default: null
    },
    choosedIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    closeCityPicker () {
      this.$emit('city-picker-close')
    },
    changeCityName (item, index) {
      this.$emit('change-city-name', item, index)
    },
    clickCityList (item) {
      this.$emit('click-city-list', item)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import "../assets/transtion.styl"
.city-list
  position fixed
  left 0
  width 100vw
  z-index 999
  bottom 0
  font-size 14px
  color #282828
  background #fff
  padding 15px 20px
  box-sizing border-box
  border-radius 6px 6px 0 0
  .list-top
    font-size 18px
    color #282828
  .list-select
    margin 30px 0
  .city-select
    font-size 14px
    position relative
    display inline-block
    margin-right 15px
    &:last-child
      margin-right 0
    &.active:after
      position absolute
      content ''
      bottom -6px
      left 50%
      width 60%
      height 2px
      z-index 20
      transform translateX(-50%)
      background-color #FF5103
  .list-data
    height 55vh
    line-height 40px
    overflow-y scroll
    .active
      color #FF5103
</style>
