<template>
  <div class="page-container detail-role-container">
    <role-detail :roleId="roleId" />
    <list-category :roleId="roleId"  />
    <list-question :roleId="roleId"  />
  </div>
</template>

<script lang="ts">
import RoleDetail from './components/RoleDetail.vue'
import ListQuestion from './components/ListQuestion.vue'
import ListCategory from './components/ListCategory.vue'
import { Component, Vue } from 'vue-property-decorator'
import _ from 'lodash'
@Component({
  name: 'EditRole',
  components: {
    RoleDetail,
    ListQuestion,
    ListCategory
  }
})
export default class extends Vue {
  private roleId = 0;
  async created() {
    this.roleId = parseInt(this.$route.params.id)
  }
}
</script>
<style lang="scss">
.detail-role-container {
  padding: 20px 50px 20px 50px;
  .mt-2 {
    margin-top: 2rem;
  }
}
</style>
