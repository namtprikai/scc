<template>
  <div class="page-container">
    <el-card class="box-card mt-2">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.roleQuestionList") }}</span>
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
          prop="title"
          align="center"
        >
          <template slot-scope="{row}">
            <!-- <div v-for="item in row.category" :key="item.id">abc</div> -->
            <div class="item-category">
              <el-link
               class="category-name"
                v-for="(item, index) in row.category"
                :key="item.id"
                type="primary"
                :underline="false"
                >{{
                  `${item}${getseparatorCharactor(index, row.category.length)} `
                }}</el-link
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('labelText.questionTitle')"
          prop="title"
          align="center"
        />
        <el-table-column
          :label="$t('labelText.questionLabel')"
          prop="label"
          align="center"
        />
        <el-table-column
          :label="$t('labelText.questionIsPublic')"
          prop="isPublic"
          align="center"
          width="80"
        >
          <template slot-scope="{row}">
            <el-checkbox disabled v-model="row.isPublic" />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="questions.length > 0"
        :total="questions.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { questionRole } from '@/api/roles'
import Pagination from '@/components/Pagination/index.vue'
import _ from 'lodash'
import { ICategory } from '@/api/types'

export interface IQuestionRole {
  id: number
  category: Array<number>
  title: string
  label: string
  isPublic: boolean
  created: Date | string
  modified: Date | string
}

export interface IDetailQuestionRole {
  id: number
  category: Array<ICategory>
  title: string
  label: string
  isPublic: boolean
}

@Component({
  name: 'ListQuestionRole',
  components: {
    Pagination
  }
})
export default class extends Vue {
  listLoading = false;
  questions: Array<IDetailQuestionRole> = [];
   private listQuery = {
     page: 1,
     limit: 10
   };

  @Prop({ default: () => null }) private roleId!: number;
  // @Prop({ default: () => null }) private questions!: Array<IDetailQuestionRole>;

  created() {
    this.getListQuestionRole()
  }

  async getListQuestionRole() {
    try {
      // this.listLoading = true
      const { data } = await questionRole(this.roleId)
      const questionRoles: Array<IQuestionRole> = []
      data.forEach((element: any) => {
        questionRoles.push(
          _.mapKeys(element, (v, k) => _.camelCase(k)) as IQuestionRole
        )
      })
      console.log(questionRoles)

      this.questions = questionRoles.map(x => {
        const obj: any = { ...x }
        // x.category.forEach(categoryId => {
        //   const category = this.listCartegory.find(x => x.id === categoryId)
        //   if (category) obj.category.push(category)
        // })
        return obj
      })
      // this.list = categories
      // this.listLoading = false
    } catch (err) {
      // this.listLoading = false
    }
  }

  get paginationData() {
    return this.questions.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  getseparatorCharactor(index: number, length: number) {
    return (index >= 0 && index < length - 1 && length) > 1 ? ',' : ''
  }
}
</script>
<style lang="scss" scoped>
.category-name{
  cursor: pointer;
}
</style>
