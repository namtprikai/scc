<template>
  <div class="direct-body-left">
    <div class="border-box">
      <div class="header">Categories / Quetions</div>
      <div class="body">
        <div
          v-for="(layer, index) in categoriesQuestions"
          class="layer"
          :key="index"
        >
          <div class="item item-body border-box">
            {{ layer.text }}
          </div>

          <div
            v-for="(layer1, index) in layer.categories"
            class="layer"
            :key="index"
          >
            <div class="item-body ml-1 border-box">
              {{ layer1.text }}
            </div>

            <div
              v-for="(question, index) in layer1.questions"
              class="layer"
              :key="index"
            >
              <div
                class="item-body ml-2 border-box"
                @click="getDetailQuestion()"
              >
                {{ question.text }}
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="category border-box ml-2">Question-1</div>
        <div class="category border-box ml-2">Question-2</div>
        <div class="category border-box ml-1">Category-1.2</div>
        <div class="category border-box ml-2">Question-3</div>
        <div class="category border-box">Category-2</div> -->
      </div>

      <div class="bottom" v-show="categoriesQuestions">
        <el-button type="primary" class="btn-deploy">{{
          $t("labelText.directEditAddCategory")
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ICategoriesQuestion } from '@/api/types/category'

@Component({
  name: 'Category'
})
export default class extends Vue {
  @Prop({ default: [] }) private categoriesQuestions!: ICategoriesQuestion;
  @Prop({ default: undefined }) private idProduct!: number;
  @Prop({ default: () => null }) private getDetailQuestion!: () => null;
}
</script>

<style lang="scss" scoped>
.direct-body-left {
  $margin: 20px;
  $blue: #409eff;

  width: 40%;
  box-sizing: border-box;
  .header {
    border-bottom: 1px solid #dcdfe6;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $blue;
    padding: 0 10px;
  }
  .body {
    display: flex;
    flex-direction: column;
    align-items: end;
    padding: 10px;
    min-height: calc(100vh - 152px);

    .layer {
      width: 100%;
    }
    .item-body {
      height: 36px;
      padding: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #1f2d3d;
      cursor: pointer;

      &:focus {
        background-color: #409eff;
        color: white;
      }
    }
    .item {
      width: 100%;
      margin-bottom: 10px;
      cursor: pointer;
    }
    .ml-1 {
      width: calc(100% - #{$margin});
      margin-left: $margin;
    }
    .ml-2 {
      width: calc(100% - #{$margin * 2});
      margin-left: $margin * 2;
    }
    .ml-3 {
      width: calc(100% - #{$margin * 3});
      margin-left: $margin * 3;
    }
  }
}
.border-box {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.bottom {
  padding: 15px;
  display: flex;
  justify-content: center;
}
</style>
