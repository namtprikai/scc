<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />

    <logo
      id="logo-container"
      class="logo-container"
    />

    <notification
      id="notification-container"
      class="notification-container"
    />
    <div class="right-menu">
      <template v-if="device!=='mobile'">

      <el-button onclick="location.href = '#/test-page';" class="test-page-button">
        {{$t('text.testPage')}}
      </el-button>

      <el-button onclick="location.href = '#/production-page';" class="production-page-button" >
        {{$t('text.productionPage')}}
      </el-button>

      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="'https://toigingiuvedep.vn/wp-content/uploads/2022/01/anh-avatar-cute.jpg'"
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/">
            <el-dropdown-item>
              {{ $t('text.loggedInAdminSetting') }}
          </el-dropdown-item>
          </router-link>
          <el-dropdown-item
            divided
            @click.native="handleLogout"
          >
            <span style="display:block;">
              {{ $t('text.logout') }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { AdminModule } from '@/store/modules/admin'
import Hamburger from '@/components/Hamburger/index.vue'
import Logo from '@/components/Logo/index.vue'
import Notification from '@/components/Notification/index.vue'

@Component({
  name: 'Navbar',
  components: {
    Hamburger,
    Logo,
    Notification
  }
})

export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device.toString()
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private handleLogout() {
    AdminModule.LogOut()
    this.$router.push(`/login?redirect=${this.$route.fullPath}`).catch(err => {
      console.warn(err)
    })
  }
}

</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 5px;
    height: 100%;
    float: left;
    padding: 7px 15px;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

  .logo-container {
    border-radius: 20px;
    padding: 5px;
    float: left;
  }
  .notification-container {
    text-align: center;
  }

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 60%;
      font-size: 14px;
      color: #c0c4cc;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0,0,0, 0)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 0px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .test-page-button{
      background-color : rgba(48,65,86);
      color:#c0c4cc;

    }
    .production-page-button{
      background-color : rgba(48,65,86);
      color:#c0c4cc;
      margin-right: 8px;

    }
  }

}
@media (max-width: 800px) {
  .test-page-button {
    display : none;
  }
}
@media (max-width: 800px) {
  .production-page-button {
    display : none;
  }
}
</style>
