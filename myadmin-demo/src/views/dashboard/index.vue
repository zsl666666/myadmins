<template>
  <div class="dashboard-container">
    <div class="dashboard-text">暂无更多</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Dashboard',
  data(){
    return {
      list:null
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created(){
    // this.getdata()
    
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
