<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="aplo">
      <span @click="homePage">后台管理系统</span>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    homePage(){
      this.$router.push('/dashboard')
    }
  }
}
</script>
<style scoped>
.aplo{
 position: relative;
 top: 0;
 left: 0;
  width: 100%;
  height: 60px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  letter-spacing: 1px;
}
.aplo span{
  position: absolute;
  display: block;
  width: 170px;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  background: rgba(255,255,255,0.3);
  border-radius: 5px;
  top: 50%;
  left: 50%;
  margin-top: -18px;
  margin-left: -85px;
}
</style>