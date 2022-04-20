<template>
  <div class="container detail-edit-admin">
    <admin-detail :adminId="adminId"></admin-detail>
    <change-password v-if="isShowChangePassword" :adminId="adminId"></change-password>
    <change-product :adminId="adminId"></change-product>
    <change-policy-group :adminId="adminId"></change-policy-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AdminDetail from './components/AdminDetail.vue'
import ChangePassword from './components/ChangePassword.vue'
import ChangeProduct from './components/ChangeProduct.vue'
import ChangePolicyGroup from './components/ChangePolicyGroup.vue'
import { isLoggedInAdmin, hasPolicy } from '@/utils/common'

@Component({
  name: 'EditAdmin',
  components: {
    AdminDetail,
    ChangePassword,
    ChangeProduct,
    ChangePolicyGroup
  }
})
export default class extends Vue {
  private adminId = 0
  private isShowChangePassword = false

  async created() {
    this.adminId = parseInt(this.$route.params.adminId)
    this.isShowChangePassword = hasPolicy('change-password-admin', 'post') || isLoggedInAdmin(this.adminId)
  }
}
</script>

<style lang="scss" scoped>
.detail-edit-admin {
  // padding: 20px 50px 20px 50px;
  .mt-2 {
    margin-top: 2rem;
  }
}
</style>
