<template>
  <div class="container detail-user-container">
    <user-detail :userId="userId" />
    <change-user-condition :userId="userId" class="mt-32" />
    <change-user-product :userId="userId" class="mt-32" />
    <change-user-role :userId="userId" class="mt-32" />
  </div>
</template>

<script lang="ts">
import UserDetail from './components/UserDetail.vue'
import ChangeUserCondition from './components/ChangeUserCondition.vue'
import ChangeUserProduct from './components/ChangeUserProduct.vue'
import ChangeUserRole from './components/ChangeUserRole.vue'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'EditUser',
  components: {
    UserDetail,
    ChangeUserProduct,
    ChangeUserCondition,
    ChangeUserRole
  }
})
export default class extends Vue {
  private userId = 0;
  async created() {
    this.userId = parseInt(this.$route.params.id)
  }
}
</script>
