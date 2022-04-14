<template>
  <div class="container">
    <el-card class="box-card">
      <el-form ref="form">
        <el-form-item align="left" v-for="(item,index) in items" :key="item.id" width="100%">
          <el-input v-model="item.values" autofocus class="input-with-select">
            <el-select v-model="item.keys" slot="prepend" >
              <el-option
                v-for="ite in options"
                :key="ite.value"
                :label="ite.label"
                :value="ite.value">
              </el-option>
            </el-select>
          </el-input>
          <span class="btn-delete" v-if="index > 0">
            <el-button type="danger" @click="handleDelete(index)">{{ $t('text.delete') }}</el-button>
          </span>
        </el-form-item>

        <el-form-item align="left">
          <el-button class="btn btn--action" type="primary" @click="handleAdd()">{{ $t('text.add') }}</el-button>
        </el-form-item>

        <el-form-item align="left">
          <el-button class="btn btn--action" type="primary" @click="handleSearch()"><i class="el-icon-search">  {{ $t('screenTitle.logSearch') }}</i></el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <el-table
      v-loading="isLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" :label="$t('labelText.id')" width=50%>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('labelText.validationTableName')" min-width="130">
        <template slot-scope="scope">
         {{ scope.row.tableName }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('labelText.validationColumnName')">
        <template slot-scope="scope">
          {{ scope.row.columnName }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('labelText.validationType')" >
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('labelText.validationPattern')" min-width="130">
        <template slot-scope="scope">
          {{ scope.row.pattern }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('labelText.validationSystemMaximum')" width='80'>
        <template slot-scope="scope">
          {{ scope.row.systemMaximum }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('labelText.validationMin')" width='80'>
        <template slot-scope="scope">
          {{ scope.row.min }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('labelText.validationMax')" width='80'>
        <template slot-scope="scope">
          {{ scope.row.max }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('labelText.action')" width=100%>
        <template slot-scope="{row}">
          <router-link :to="{name: 'DetailValidation', params: {id: row.id}}">
            <el-button class="btn btn--action" type="primary" size="mini" icon="el-icon-view">
              {{ $t('text.detail') }}
            </el-button>
          </router-link>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="this.listValidation.length>0" :total="this.listValidation.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { searchValidation } from '@/api/validation'
import Pagination from '@/components/Pagination/index.vue'
import { IListValidation } from '@/api/types'
import { camelizeKeys } from '@/utils/parse'

@Component({
  name: 'SearchValidation',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private listValidation : IListValidation[] = [];
  private isLoading = true;
  private listQuery = {
    page: 1,
    limit: 10
  };

  options =
        [{
          value: 'table_name',
          label: this.$tc('labelText.validationTableName')
        }, {
          value: 'column_name',
          label: this.$tc('labelText.validationColumnName')
        }]

  items = [{ values: '', keys: 'table_name' }]
  params = ''
  valueTableName: any [] = []
  valueColumnName: any [] = []
  valueList = { table_name: this.valueTableName, column_name: this.valueColumnName }

  created() {
    this.fetchData()
  }

  async fetchData() {
    try {
      this.isLoading = true
      const { data } = await searchValidation(this.listQuery, this.params)
      const validations : IListValidation[] = camelizeKeys(data) as IListValidation[]
      this.listValidation = validations
      this.isLoading = false
    } catch {
    }
  }

  private get list() {
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.listValidation.slice(start, end)
  }

  handleAdd() {
    this.items.push({ values: '', keys: 'table_name' })
  }

  handleDelete(index : number) {
    this.items.splice(index, 1)
  }

  handleSearch() {
    for (const item in this.items) {
      if (this.items[item].keys && this.items[item].values.length !== 0) {
        if (this.items[item].keys === 'table_name') {
          this.valueList.table_name.push(this.items[item].values)
        } else {
          this.valueList.column_name.push(this.items[item].values)
        }
      }
    }
    this.params = 'table_name=' + '[' + this.valueList.table_name.map(x => "'" + x + "'") + ']' + '&' + 'column_name=' + '[' + this.valueList.column_name.map(x => "'" + x + "'") + ']'

    this.fetchData()
    this.valueList = { table_name: [], column_name: [] }
  }
}
</script>

<style lang="scss" scoped>

.btn--action{
  text-align:center;
}
.btn-delete{
  margin-left: 10px;
}
.el-select {
    width: 120px;
  }
.el-input {
    width: 50%;
  }
.input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
