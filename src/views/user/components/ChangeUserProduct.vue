<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.userProductModify") }}</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="paginationData"
        row-key="id"
        border
        fit
        max-height="600"
        highlight-current-row
        style="width: 100%"
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
          min-width="200"
        >
          <template slot-scope="{row}">
            <el-link type="primary">
              <router-link
                :to="{name: 'EditProduct', params: {id: row.id}}"
              >
                <span>{{ row.name }}</span>
              </router-link>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('text.enable')" align="center" width="100">
          <template slot-scope="{row}">
            <el-checkbox
              :checked="isRowSelected(row.id)"
              @change="toggleRowSelection(row, $event)"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="products.length > 0"
        :total="products.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
      <el-row :class="products.length > 0 ? '' : 'mt-32'">
        <el-button
          type="primary"
          @click.native.prevent="confirmDataModal"
          :disabled="products.length === 0"
          >{{ $t("text.update") }}</el-button
        >
      </el-row>
    </el-card>
    <confirm-dialog
      :dialogVisible.sync="confirmdialogVisible"
      :confirmData="confirmData"
      :title="$t('text.modifyScreenModalConfirmTitle')"
      @ok="handelUpdateUser"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IProductListItemData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { getProduct } from '@/api/production'
import { getUserProducts, updateUserProducts } from '@/api/users'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

@Component({
  name: 'UpdateUserProduct',
  components: {
    Pagination,
    ConfirmDialog
  }
})
export default class extends Vue {
  isFormSubmitting = false;
  confirmData: any = null;
  public confirmdialogVisible = false;
  listLoading = false;
  products: Array<IProductListItemData> = [];
  userProducts: Array<IProductListItemData> = [];
  userProductsOld: Array<IProductListItemData> = [];
  userProductsAdd: Array<IProductListItemData> = [];
  userProductsDelete: Array<IProductListItemData> = [];

  @Prop({ default: () => null }) private userId!: number;

  created() {
    this.getListUserProducts()
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

  async getListUserProducts() {
    try {
      this.listLoading = true
      const { data } = await getUserProducts(this.userId)
      this.userProducts = data
      this.userProductsOld = [...this.userProducts]
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
    }
    this.getListProducts()
  }

  async getListProducts() {
    try {
      this.listLoading = true

      // get list products
      const { data } = await getProduct({})
      this.products = data
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
    }
  }

  isRowSelected(id: number) {
    return this.userProducts.some((item) => item.id === id)
  }

  toggleRowSelection(row: IProductListItemData, checked: boolean) {
    if (checked) {
      this.userProducts.push({ ...row })
    } else {
      this.userProducts = this.userProducts.filter(
        (item) => item.id !== row.id
      )
    }
    this.$emit('input', this.userProducts)
  }

  // confirm data
  confirmDataModal() {
    this.confirmData = []
    this.userProductsAdd = this.userProducts.filter(
      (x) => !this.userProductsOld.some((item) => item.id === x.id)
    )
    this.userProductsDelete = this.userProductsOld.filter(
      (x) => !this.userProducts.some((item) => item.id === x.id)
    )
    if (this.userProductsAdd.length !== 0) {
      this.userProductsAdd.forEach((item: any) => {
        this.confirmData.push({
          key: `${item.id}.${item.name}`,
          value: this.$tc('text.userProductEnableYes')
        })
      })
    }
    if (this.userProductsDelete.length !== 0) {
      this.userProductsDelete.forEach((item: any) => {
        this.confirmData.push({
          key: `${item.id}.${item.name}`,
          value: this.$tc('text.userProductEnableNo')
        })
      })
    }
    this.confirmdialogVisible = true
  }

  // submit update user product
  async handelUpdateUser() {
    if (!this.userProductsAdd.length && !this.userProductsDelete.length) {
      return
    }
    this.isFormSubmitting = true
    try {
      await updateUserProducts(this.userId, {
        product_id: this.userProductsAdd.map((x) => x.id),
        delete_id: this.userProductsDelete.map((x) => x.id)
      })
      this.isFormSubmitting = false
      // show pop up success message
      this.$alert(this.$t('message.userProductModifySuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })
      // set user origin data is user new data
      this.userProductsOld = [...this.userProducts]
      this.userProductsAdd = []
      this.userProductsDelete = []
    } catch (err) {
      this.isFormSubmitting = false
    }
  }
}
</script>
