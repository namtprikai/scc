<template>
    <div class="card">
        <el-card class="box-card">
            <div v-loading="loading"
                v-bind:element-loading-text="loadingText"
                class="loading-verify"
            >
            </div>
            <div v-if="status===1" class="message">
                <el-row>
                    {{$t('message.adminActiveSuccess')}}
                </el-row>
                <el-button class="goto-login" @click="gotoLogin">
                    {{$t('text.gotoLoginScreen')}}
                </el-button>
            </div>
            <div v-else-if="status===2" class="message">
                {{$t('message.adminActiveError')}}
            </div>
        </el-card>
    </div>
</template>
<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { enabledVerifyEmail } from '@/api/admins'

@Component({
  name: 'VerifyEmailCreateAccount',
  watch: {
    $route: {
      immediate: true,
      handler() {
        document.title = this.$t('screenTitle.activeAdmin').toString()
      }
    }
  }
})
export default class extends Vue {
  private status = 0 // 0: notThing, 1: isSuccess, 2: isError
  private loading = true
  private loadingText=this.$t('message.adminActivating')

  created() {
    this.handleVerifyEmail()
  }

  private async handleVerifyEmail(): Promise<void> {
    this.loading = true
    this.status = 0
    try {
      await enabledVerifyEmail(this.$route.params.hash)
      setTimeout(() => {
        this.loading = false
      }, 1 * 1000)
      setTimeout(() => {
        this.status = 1
      }, 1.2 * 1000)
    } catch (err) {
      setTimeout(() => {
        this.loading = false
      }, 1 * 1000)
      setTimeout(() => {
        this.status = 2
      }, 1.2 * 1000)
    }
  }

  private gotoLogin(): void {
    this.$router.push('/login')
  }
}
</script>
<style lang="scss">
    .box-card{
        width: 480px;
        height: 200px;
        position: relative;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .card{
        position: relative;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .loading-verify{
        width: 480px;
    }
    .el-loading-spinner{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .el-loading-text{
        padding-left: 16px;
        padding-top: 11px;
    }
    .message{
        text-align: center;
        justify-content: center;
    }
    .goto-login{
        margin-top: 20px;
    }
</style>
