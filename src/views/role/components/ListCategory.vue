<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.roleCategoryList") }}</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="paginationData"
        border
        fit
        max-height="600"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          :label="$t('labelText.id')"
          prop="id"
          align="center"
          width="80"
        />
        <el-table-column
          :label="$t('labelText.categoryLabel')"
          prop="label"
          align="center"
        />
        <el-table-column
          :label="$t('labelText.categoryText')"
          prop="text"
          align="center"
        />
      </el-table>
      <pagination
        v-show="categories.length > 0"
        :total="categories.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ICategory } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { mapKeys, camelCase } from 'lodash'
import { categoryRole } from '@/api/roles'
@Component({
  name: 'ListCategoryRole',
  components: {
    Pagination
  }
})
export default class extends Vue {
  listLoading = false;
  categories: Array<ICategory> = [];

  @Prop({ default: () => null }) private roleId!: number;

  created() {
    this.getListCategoryRole()
  }

  private listQuery = {
    page: 1,
    limit: 10
  };

  get paginationData() {
    return this.categories.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  async getListCategoryRole() {
    try {
      this.listLoading = true
      const { data } = await categoryRole(this.roleId)
      const categories: Array<ICategory> = []
      data.forEach((element: any) => {
        categories.push(
          mapKeys(element, (v, k) => camelCase(k)) as ICategory
        )
      })
      this.categories = categories
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
    }
  }
}
</script>
