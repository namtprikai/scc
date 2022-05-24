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
        @click="getDetailCategory(categoryItem.id, categoryItem.type, true)"
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
          <div v-if="categoryItem.type === 'categories'">
            <ul
              v-if="menuDisabled || categoryItem.disabled"
              class="category-list-menu disabled"
              :id="'category-list-menu-'+categoryItem.id"
              style="overflow:auto"
            >
              <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id">{{$t('text.directEditAddChildCategory')}}</li>
              <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id">{{$t('text.directEditAddNewQuestion')}}</li>
              <li class="category-list-menu-item border" :id="'category-list-menu-item-'+categoryItem.id">{{$t('text.directEditAddToProduct')}}</li>
              <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id">{{$t('text.delete')}}</li>
            </ul>
            <ul
              v-else
              class="category-list-menu"
              :id="'category-list-menu-'+categoryItem.id"
              style="overflow:auto"
            >
              <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="addChildCategory(categoryItem.id, categoryItem.level, categoryItem.products, index)">{{$t('text.directEditAddChildCategory')}}</li>
              <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="addNewQuestion(categoryItem.id, categoryItem.level, categoryItem.products, index)">{{$t('text.directEditAddNewQuestion')}}</li>
              <li class="category-list-menu-item border" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="addToProduct(categoryItem.id, keyTitleDialog, categoryItem.products, 'categories')">{{$t('text.directEditAddToProduct')}}</li>
              <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="deleteItem(categoryItem.id, 'categories')">{{$t('text.delete')}}</li>
            </ul>
          </div>
        <!-- End: Category menu-->

        <!-- Begin: Question menu-->
          <div v-else>
            <ul
              v-if="menuDisabled || categoryItem.disabled"
              class="category-list-menu disabled"
              :id="'category-list-menu-'+categoryItem.id"
              style="overflow:auto"
            >
              <li class="category-list-menu-item border" :id="'category-list-menu-item-'+categoryItem.id">{{$t('text.directEditAddToProduct')}}</li>
              <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id">{{$t('text.delete')}}</li>
            </ul>
            <ul
              v-else
              class="category-list-menu"
              :id="'category-list-menu-'+categoryItem.id"
              style="overflow:auto"
            >
              <li class="category-list-menu-item border" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="addToProduct(categoryItem.id, keyTitleDialog, categoryItem.products, 'question')">{{$t('text.directEditAddToProduct')}}</li>
              <li class="category-list-menu-item" :id="'category-list-menu-item-'+categoryItem.id" @click.prevent="deleteItem(categoryItem.id, 'question')">{{$t('text.delete')}}</li>
            </ul>
          </div>
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
  numChildCategory = 1
  categoryItemSelected = ''
  menuDisabled = false

  arrayCategories: any = []
  arrayCategoriesOld: any = null
  newCategoryDetail: any = null
  newQuestionDetail: any = null

  @Watch('listCategories') onListCategoriesChange() {
    this.getArrayCategory(this.listCategories, 1, 'categories')
  }

  @Watch('arrayCategories') onArrayCategoriesChange() {
    this.$emit('reloadListCategory', this.productId)
  }

  getArrayCategory(categories: any, level: number, type: string, arrayGroupCategories: any = [], parent = true) {
    for (let i = 0; i < categories.length; i++) {
      // Get parent category
      const objCategory = { id: categories[i].id, text: categories[i].text, products: categories[i].products, level: level, type: type }
      arrayGroupCategories.push(objCategory)

      // If exist question then get all questions and push in arrayGroupCategories
      if (categories[i].questions && categories[i].questions.length > 0) {
        const arrayQuestions = categories[i].questions
        for (let x = 0; x < arrayQuestions.length; x++) {
          arrayGroupCategories.push({ id: arrayQuestions[x].id, text: arrayQuestions[x].text, products: arrayQuestions[x].products, level: level + 1, type: 'questions' })
        }
      }

      // Check if exist child categories the get and push in to arrGroupCateories
      if (categories[i].categories && categories[i].categories.length > 0) {
        this.getArrayCategory(categories[i].categories, level + 1, 'categories', arrayGroupCategories, false)
      }

      // Push array group categories to array categories
      if (parent === true) {
        this.arrayCategories[i] = arrayGroupCategories
        arrayGroupCategories = []
      }
    }
  }

  /* Begin: Function get detail category */
  getDetailCategory(id: any, type: string, click = false) {
    if (click) this.menuDisabled = false
    if (this.arrayCategoriesOld !== null && this.categoryItemSelected !== id.toString()) {
      this.arrayCategories = this.arrayCategoriesOld
      this.numChildCategory = 1
    }
    this.activeItem = type + '_' + id

    /* addChildCategory: if true - category add from click to button addChildCategory
                        false - category select from database */
    let data = { id, type, addChildCategory: false }
    /* Check if typeof(id) is string then data = newCategoryDetail */
    if (typeof (id) === 'string') {
      if (type === 'categories') data = this.newCategoryDetail
      else data = this.newQuestionDetail
    }
    this.$emit('detailCategory', data)
  }

  isActive(id: number, type: string) {
    return this.activeItem === type + '_' + id
  }

  /* Begin: Function add child category */
  private addChildCategory(parentId: number, parentLevel: number, products: any, categoryGroup: number) {
    this.menuDisabled = true
    this.arrayCategoriesOld = Object.assign({}, this.arrayCategories)
    const idChildCategory = this.makeid()
    this.categoryItemSelected = idChildCategory
    const newCategoryItem = { id: idChildCategory, level: parentLevel + 1, products: products, text: 'Category new ' + this.numChildCategory, type: 'categories', disabled: true }

    for (let i = 0; i < this.arrayCategories[categoryGroup].length; i++) {
      if (this.arrayCategories[categoryGroup][i].id === parentId) {
        this.arrayCategories[categoryGroup].splice(i + 1, 0, newCategoryItem)
        break
      }
    }
    /* New category detail */
    this.newCategoryDetail = {
      label: 'Category new ' + this.numChildCategory,
      text: 'Category new ' + this.numChildCategory,
      config: {},
      parentId: parentId,
      type: 'categories',
      productId: this.productId,
      addChildCategory: true
    }

    this.numChildCategory++
    this.activeItem = 'categories_' + idChildCategory

    this.getDetailCategory(idChildCategory, 'categories')

    /* Re-render view */
    this.$forceUpdate()
  }

  /* Begin: Function add new question */
  private addNewQuestion(parentId: number, parentLevel: number, products: any, categoryGroup: number) {
    this.menuDisabled = true
    this.arrayCategoriesOld = Object.assign({}, this.arrayCategories)
    const idNewQuestion = this.makeid()
    this.categoryItemSelected = idNewQuestion

    const newQuestionItem = { id: idNewQuestion, level: parentLevel + 1, products: products, text: 'Question new ' + this.numChildCategory, type: 'question', disabled: true }
    for (let i = 0; i < this.arrayCategories[categoryGroup].length; i++) {
      if (this.arrayCategories[categoryGroup][i].id === parentId) {
        this.arrayCategories[categoryGroup].splice(i + 1, 0, newQuestionItem)
        break
      }
    }

    /* Create new question detail to pass detail screen */
    this.newQuestionDetail = {
      id: idNewQuestion,
      title: 'Question new ' + this.numChildCategory,
      label: 'Question new ' + this.numChildCategory,
      isPublic: true,
      config: {},
      keywords: [],
      answer: {
        id: 0,
        text: '',
        config: {}
      },
      type: 'question',
      addNewQuestion: true
    }

    this.numChildCategory++
    this.activeItem = 'question_' + idNewQuestion

    this.getDetailCategory(idNewQuestion, 'question')

    /* Re-render view */
    this.$forceUpdate()
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

<style lang="scss" scoped>
.card_item_title{
  text-align: center;
  color: #0F93FF;
}
.box-card {
  padding-bottom: 20px;
}
.infinite-list{
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 0;
}
.infinite-list-item{
  border: 1px solid #dcdfe6;
  list-style: none;
  margin-bottom: 10px;
  min-height: 20px;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-radius: 3px;
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
  min-height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
}

.category-list-menu-item:hover{
  background: #f2f8fe;
}

.border{
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
}

.active {
  background-color: #F8CECC;
  border: 1px solid #B85450;
}

.disabled {
  color: rgb(163, 160, 160);
}
</style>
