<template>
  <el-card
    class="box-card"
    :shadow="'never'"
    >
    <div slot="header" class="clearfix card_item_title">
      <span>{{$t('text.directEditCategoriesQuestionTitle')}}</span>
    </div>
    <ul class="infinite-list" style="overflow:auto" v-for="groupCat, index in listCategories" :key="index">
      <li
        v-for="categoryItem, key of arrayCategories[index]"
        :key="key"
        :class="{'infinite-list-item': true, 'active': isActive(categoryItem.id, categoryItem.type)}"
        :style="{width: categoryItem.level === 1 ? elementWidth : (parseInt(elementWidth) - (categoryItem.level*5)+'%')}"
        :id="'category_item_'+categoryItem.id"
        @click="getDetailCategory(categoryItem.id, categoryItem.type)"
      >
        {{categoryItem.text}}
        <!-- Begin: Category menu-->
        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
          :id="'category-menu-box-'+categoryItem.id"
          popper-class="category-menu-box"
        >
          <ul
            class="category-list-menu"
            :id="'category-list-menu-'+categoryItem.id"
            style="overflow:auto"
            v-if="categoryItem.type === 'categories'"
          >
            <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="addChildCategory(categoryItem.id, categoryItem.level, categoryItem.products, index)">{{$t('text.directEditAddChildCategory')}}</li>
            <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id">{{$t('text.directEditAddNewQuestion')}}</li>
            <li class="category-list-menu-item border" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="addToProduct(categoryItem.id, keyTitleDialog, categoryItem.products, 'categories')">{{$t('text.directEditAddToProduct')}}</li>
            <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="deleteItem(categoryItem.id, 'categories')">{{$t('text.delete')}}</li>
          </ul>
        <!-- End: Category menu-->

        <!-- Begin: Question menu-->
          <ul
            class="category-list-menu"
            :id="'category-list-menu-'+categoryItem.id"
            style="overflow:auto"
            v-else
          >
            <li class="category-list-menu-item border" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="addToProduct(categoryItem.id, keyTitleDialog, categoryItem.products, 'question')">{{$t('text.directEditAddToProduct')}}</li>
            <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="deleteItem(categoryItem.id, 'question')">{{$t('text.delete')}}</li>
          </ul>
        <!-- End: Question menu-->

          <el-button slot="reference" icon="el-icon-more"></el-button>
        </el-popover>
      </li>
    </ul>
    <modal-add-category-product
      :modalTitle="$t(titleDialog)"
      :visible.sync="dialogAddVisible"
      :selectLabel="$t('text.directEditAddToProduct')"
      :options="listProduct"
      :data="itemSelectedData"
      @updateVisible="changeVisible"
    />
    <modal-category-delete
      :visible.sync="dialogDeleteVisible"
      :data="itemSelectedData"
      :error="errorVerifyDelete"
      :productId="productId"
      @updateVisible="changeVisible"
      @delete="handleDelete"
    />
    <confirm-dialog
      :title="$t('message.categoryDeleteSuccess')"
      :dialogVisible.sync="confirmVisible"
      :confirmData="confirmData"
      @ok="handleSubmit"
    >
    </confirm-dialog>
  </el-card>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import ModalAddCategoryProduct from '@/views/direct-edit/components/Modal/ModalAddCategoryProduct.vue'
import ModalCategoryDelete from '@/views/direct-edit/components/Modal/ModalCategoryDelete.vue'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import { Prop, Watch } from 'vue-property-decorator'
import { forEach } from 'lodash'
import { delCategoryProduct, delCategory } from '@/api/categories'
import { delQuestion, delQuestionProduct } from '@/api/questions'
import { APIErrorCode, APIError } from '@/utils/request'

interface CategoryListItem {
  id: number
  products: Array<number>
  text: string
  questions: any
  categories: any
}

@Component({
  name: 'ListCategory',
  components: {
    ModalAddCategoryProduct,
    ModalCategoryDelete,
    ConfirmDialog
  }
})

export default class ListCategory extends Vue {
  // Prop get list category from parent screen
  @Prop({ default: () => null }) private listCategories!: Array<CategoryListItem>;
  @Prop({ default: () => null }) private listProduct!: any
  @Prop({ default: () => null }) private productId!: number

  titleDialog = ''
  dialogAddVisible = false
  dialogDeleteVisible = false
  confirmVisible = false
  confirmData = []
  keyTitleDialog = 'directEditAddCategoryToProductsTitle'
  errorVerifyDelete = false
  itemSelectedData = {}
  typeItemSelected = ''
  productItemSelected = null
  elementWidth = '100%'
  activeItem = ''
  isLoading = false

  arrayCategories: any = []

  @Watch('listCategories') onListCategoriesChange() {
    this.getArrayCategory(this.listCategories, 1, 'categories')
  }

  @Watch('arrayCategories') onArrayCategoriesChange() {
    this.$emit('reloadListCategory', this.productId)
  }

  getArrayCategory(categories: any, level: number, type: string) {
    for (let i = 0; i < categories.length; i++) {
      const arrayGroupCategories: any = []

      // Get parent category
      const objCategory = { id: categories[i].id, text: categories[i].text, products: categories[i].products, level: level, type: type }
      arrayGroupCategories.push(objCategory)

      // Check if exist child categories the get and push in to arrGroupCateories
      if (categories[i].categories) {
        level++
        this.getChildCategories(categories[i].categories, level, arrayGroupCategories)
      }

      if (categories[i].questions) {
        level++
        this.getQuestions(categories[i].questions, level, arrayGroupCategories)
      }
      level = 1

      // Push array group categories to array categories
      this.arrayCategories[i] = arrayGroupCategories
    }
  }

  getChildCategories(categories: any, level: number, arrayGroupCategories: any) {
    forEach(categories, function(category) {
      arrayGroupCategories.push({ id: category.id, text: category.text, products: category.products, level: level, type: 'categories' })
    })
  }

  getQuestions(questions: any, level: number, arrayGroupCategories: any) {
    forEach(questions, function(question) {
      arrayGroupCategories.push({ id: question.id, text: question.text, products: question.product_id, level: level, type: 'questions' })
    })
  }

  /* Begin: Function get detail category */
  getDetailCategory(id: number, type: string) {
    this.activeItem = type + '_' + id
    this.$emit('detailCategory', { id, type })
  }

  isActive(id: number, type: string) {
    return this.activeItem === type + '_' + id
  }

  /* Begin: Function add child category */
  addChildCategory(parentId: number, parentLevel: number, products: any, categoryGroup: number) {
    const idChildCategory = this.makeid()
    const newCategoryItem = { id: idChildCategory, level: parentLevel + 1, products: products, text: 'Category new ' + idChildCategory, type: 'categories' }
    this.arrayCategories[categoryGroup].push(newCategoryItem)
    // this.$emit('reloadListCategory', this.productId)
  }

  /* Begin: Function add category to product */
  addToProduct(idCategory: number, keyTitle: string, products: any, type: string) {
    this.titleDialog = 'text.' + keyTitle
    this.dialogAddVisible = true
    this.itemSelectedData = {
      id: idCategory,
      type: type,
      products: products
    }
  }

  /* Begin: Function update visible of modal when user press button cancel in modal */
  changeVisible(result: any) {
    if (result.type === 'add') this.dialogAddVisible = result.status
    else this.dialogDeleteVisible = result.status
  }

  /* Begin: Function delete category/question */
  deleteItem(id: number, type: string) {
    this.dialogDeleteVisible = true
    this.itemSelectedData = {
      id: id,
      type: type
    }
  }

  /* Begin: Function handle delete category when user click button delete in modal */
  async handleDelete(confirmDelete: any) {
    try {
      /* Delete category */
      if (confirmDelete.type === 'categories') {
        if (confirmDelete.checked) {
          if (confirmDelete.input === '削除') {
            /* Check showed message error then hidden message */
            if (this.errorVerifyDelete === true) this.errorVerifyDelete = false

            /* Call API delete category */
            await delCategory(confirmDelete.id)
            this.$alert(this.$t('message.categoryDeleteSuccess') as string, '', {
              confirmButtonText: this.$t('text.ok') as string,
              type: 'success',
              center: true
            })
          } else {
            this.errorVerifyDelete = true
            return
          }
        } else {
          await delCategoryProduct(confirmDelete.id, { product_id: confirmDelete.productId })
          this.$alert(this.$t('message.categoryDeleteSuccess') as string, '', {
            confirmButtonText: this.$t('text.ok') as string,
            type: 'success',
            center: true
          })
        }
      } else {
        /* Delete questions */
        if (confirmDelete.checked) {
          if (confirmDelete.input === '削除') {
            /* Check showed message error then hidden message */
            if (this.errorVerifyDelete === true) this.errorVerifyDelete = false

            /* Call API delete category */
            await delQuestion(confirmDelete.id)
            this.$alert(this.$t('message.questionDeleteSuccess') as string, '', {
              confirmButtonText: this.$t('text.ok') as string,
              type: 'success',
              center: true
            })
          } else {
            this.errorVerifyDelete = true
            return
          }
        } else {
          await delQuestionProduct(confirmDelete.id, { delete_id: confirmDelete.productId })
          this.$alert(this.$t('message.questionDeleteSuccess') as string, '', {
            confirmButtonText: this.$t('text.ok') as string,
            type: 'success',
            center: true
          })
        }
      }
      this.dialogDeleteVisible = false
      this.$emit('reloadListCategory', this.productId)
    } catch (error) {
      if (error instanceof APIError && error.errorCode === APIErrorCode.Unauthorized) {
        this.$message({
          message: this.$tc('message.serverConnectError'),
          type: 'error',
          duration: 5000
        })
      }
    }
  }

  handleSubmit() {
    console.log('Oke')
  }

  /* Begin: Function random Id category when add child category */
  private makeid(length = 5) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  /* End: private makeid(length = 5) */
}
</script>

<style>
.infinite-list{
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.infinite-list-item{
  border: 1px solid;
  list-style: none;
  margin-bottom: 10px;
  min-height: 20px;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

/* Category menu */
.category-menu-box{
  padding: 0;
  border: 1px solid #999999;
}
.category-list-menu{
  padding: 0;
  margin: 0;
}
.category-list-menu-item{
  list-style: none;
  margin-bottom: 10px;
  min-height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.category-list-menu-item:hover{
  background: #ccc;
}

.border{
  border-top: 1px solid #999999;
  border-bottom: 1px solid #999999;
  box-sizing: border-box;
}

.active {
  background-color: #F8CECC;
  border: 1px solid #B85450;
}
</style>
