<template>
  <div class="page-container question-role">
    <el-card class="box-card">
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
            <div v-if="row.category" class="question-category">
              <span v-for="(item, index) in row.category" :key="index">
                <el-link
                  class="category-name"
                  type="primary"
                  :underline="false"
                  @click="toDetailEditQuestion(item.id)"
                  >{{ item.label }}</el-link
                >
                <!-- show  separator-->
                <span v-if="row.category.length&&index >= 0 && index < row.category.length - 1">{{' , '}}</span>
              </span>
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
import { questionRole, categoryRole } from '@/api/roles'
import Pagination from '@/components/Pagination/index.vue'
import { mapKeys, camelCase } from 'lodash'
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
export interface ICategoryQuestionRole {
  id: number
  label: string
}

export interface IQuestionRoleDetail {
  id: number
  category: Array<ICategoryQuestionRole>
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
  questions: Array<IQuestionRoleDetail> = [];
  private listQuery = {
    page: 1,
    limit: 10
  };

  @Prop({ default: () => null }) private roleId!: number;

  created() {
    this.getListQuestionRole()
  }

  async getListQuestionRole() {
    try {
      this.listLoading = true
      // Get all category role
      const categoryResponse = await categoryRole(this.roleId, { all: true })
      const categories: Array<ICategory> = []
      categoryResponse.data.forEach((element: any) => {
        categories.push(mapKeys(element, (v, k) => camelCase(k)) as ICategory)
      })
      // get question role
      const questionResponse = await questionRole(this.roleId)
      const questionRoleDetails: Array<IQuestionRoleDetail> = []
      questionResponse.data.forEach((element: any) => {
        // clone to IQuestionRoleDetail from
        const questionDetail: IQuestionRoleDetail = {
          ...element,
          category: []
        }
        // get list category of question from list category of role
        element.category.forEach((categoryId:any) => {
          const category = categories.find(x => x.id === categoryId)
          // add category to list of category question
          if (category) {
            questionDetail.category.push({
              id: category.id,
              label: category.label
            })
          }
        })
        questionRoleDetails.push(questionDetail)
      })
      this.questions = questionRoleDetails
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
    }
  }

  // handle pagination change
  get paginationData() {
    return this.questions.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  // route to detail edit quesiton
  toDetailEditQuestion(id: string) {
    this.$router.push({ name: 'DetailEditQuestion', params: { id } })
  }
}
</script>
<style lang="scss" scoped>
.question-role {
  .category-name {
    cursor: pointer;
  }
  .question-category{
    .category-name {
      display: inherit;
    }
  }
}
</style>
