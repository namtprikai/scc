<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.adminProductModify") }}</span>
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
          :label="$t('labelText.productName')"
          prop="name"
          align="center"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              :underline="false"
              @click="toDetailEditProduct(row.id)"
              >{{ row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('text.enable')"
          prop="isCheck"
          align="center"
        >
          <template slot-scope="{row}">
            <el-checkbox
              v-model="row.isCheck"
              name="type"
              @change="updateDeleteProduct(row, $event)"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="products.length > 0"
        :total="products.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
      <el-button v-if="products.length > 0" type="primary" @click="showModal">
        {{ $t("text.update") }}
      </el-button>
      <confirm-dialog
        :title="$t('text.modifyScreenModalConfirmTitle')"
        :dialogVisible.sync="dialogFormVisible"
        :confirmData="confirmData"
        :keyColumnWidth="50"
        :valueColumnWidth="50"
        @ok="handleSubmit"
      >
      </confirm-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import {
  IProductListItemData,
  IListChangeProductAdminItem,
  IUpdateProductAdmin
} from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { hasPolicy } from '@/utils/common'
import { PolicyMethod, PolicyUriName } from '@/utils/constant'
import { getProduct } from '@/api/production'
import { changeProductAdmin, getListProductAdmin } from '@/api/admins'
import { camelizeKeys, snakeKeys } from '@/utils/parse'
import { ValidationError } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

@Component({
  name: 'ChangeProductAdmin',
  components: {
    Pagination,
    ConfirmDialog
  }
})
export default class extends Vue {
  @Prop({ default: () => null }) private adminId!: number;
  listLoading = false;
  products: Array<IListChangeProductAdminItem> = [];
  productsAdminChange: Array<IProductListItemData> = [];
  originAddProducts: Array<number> = [];
  confirmData: any = [];
  dialogFormVisible = false;
  updateProductAdmin: IUpdateProductAdmin = {
    productId: [],
    deleteId: []
  };

  created() {
    this.getListProduct()
  }

  private listQuery = {
    page: 1,
    limit: 10
  };

  get paginationData() {
    return this.products.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  async getListProduct() {
    try {
      this.updateProductAdmin = {
        productId: [],
        deleteId: []
      }
      this.originAddProducts = []
      if (hasPolicy(PolicyUriName.GetListCreateProduct, PolicyMethod.Get)) {
        const { data } = await getProduct({})
        const productAdminLogin: IListChangeProductAdminItem[] = camelizeKeys(
          data
        )
        if (hasPolicy(PolicyUriName.GetUpdateProductAdmin, PolicyMethod.Get)) {
          const products = await getListProductAdmin(this.adminId)
          this.productsAdminChange = camelizeKeys(products.data)
        }
        productAdminLogin.forEach(product => {
          product.isCheck = this.productsAdminChange.some(
            x => product.id === x.id
          )
          if (product.isCheck) {
            this.originAddProducts.push(product.id)
          }
        })
        this.products = productAdminLogin
      }
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
    }
  }

  // route to detail edit product
  toDetailEditProduct(id: string) {
    this.$router.push({ name: 'EditProduct', params: { id } })
  }

  updateDeleteProduct(item: IListChangeProductAdminItem, checked: boolean) {
    if (checked) {
      if (!this.originAddProducts.some(x => x === item.id)) {
        this.updateProductAdmin.productId.push(item.id)
      }
      this.updateProductAdmin.deleteId = this.updateProductAdmin.deleteId.filter(
        x => x !== item.id
      )
    } else {
      if (this.originAddProducts.some(x => x === item.id)) {
        this.updateProductAdmin.deleteId.push(item.id)
      }
      this.updateProductAdmin.productId = this.updateProductAdmin.productId.filter(
        x => x !== item.id
      )
    }
  }

  private async showModal() {
    this.confirmData = []
    this.products.forEach(item => {
      if (this.updateProductAdmin.productId.some(x => x === item.id)) {
        this.confirmData.push({
          key: item.id + '.' + item.name,
          value: this.$t('text.adminProductIsEnabledYes')
        })
      }
      if (this.updateProductAdmin.deleteId.some(x => x === item.id)) {
        this.confirmData.push({
          key: item.id + '.' + item.name,
          value: this.$t('text.adminProductIsEnabledNo')
        })
      }
    })
    this.dialogFormVisible = true
  }

  async handleSubmit() {
    const model: any = snakeKeys(this.updateProductAdmin)
    try {
      const { data } = await changeProductAdmin(this.adminId, model)
      if (data) {
        // show modal create successfully
        this.$alert(this.$t('message.adminProductModifySuccess') as string, '', {
          confirmButtonText: this.$t('text.ok') as string,
          type: 'success',
          center: true,
          callback: () => {
            this.getListProduct()
          }
        })
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationError = err as ValidationError
        if (validationError.data?.length) {
          validationError.data.forEach(err => {
            // get message error
            switch (err.value) {
              case 'product_id':
                this.$message({
                  message: getValidationMessage(err.type[0]) as string,
                  type: 'error',
                  duration: 2000
                })
                break
              case 'delete_id':
                this.$message({
                  message: getValidationMessage(err.type[0]) as string,
                  type: 'error',
                  duration: 2000
                })
                break
              default:
                break
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page-container {
  margin-bottom: 32px;
  .mt-24 {
    margin-top: 24px;
  }
}
</style>
