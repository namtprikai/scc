<template>
  <div class="group-tags">
    <div class="tag">
      <ul class="ti-tags">
        <li class="ti-tag" v-for="(tag, index) in tags" :key="index">
          <el-tag closable @close="removeTag(index)">
            {{tag}}
          </el-tag>
        </li>
        <li class="ti-tag">
          <input
            class="hide-input ti-new-tag-input-wrapper"
            type="text"
            v-model="valueCopy"
            v-on:keyup.enter="onEnter"
            placeholder="Enter keywork"
          />
        </li>
      </ul>

      <el-button type="primary" class="btn-delete" @click="$emit('removeKeyword', index)">{{
        $t("text.delete")
      }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'TagsInput'
})
export default class extends Vue {
  @Prop({ required: true }) private values!: string[]
  @Prop({ required: true }) private index!: number

  private valueCopy = ''
  private tags: string[] = this.values || []

  validateNewTag() {
    for (const item of this.tags) {
      if (item === this.valueCopy.trim()) {
        return false
      }
    }

    return true
  }

  onEnter() {
    if (this.validateNewTag()) {
      this.tags.push(this.valueCopy.trim())
      this.$emit('updateKeyword', { index: this.index, tags: this.tags })
    }

    this.valueCopy = ''
  }

  removeTag(index: number) {
    this.tags.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
.group-tags {
  display: flex;
  flex-direction: column;
  .tag {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .ti-tags {
    width: calc(100% - 76px);
    display: flex;
    flex-wrap: wrap;
    line-height: 1em;
    list-style-type: none;
    border: 1px solid #dcdfe6;;
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    border-radius: 4px;
    li {
      padding: 5px 8px;
      margin: 2px;
    }
    .ti-tag {
      color: #1e2a31;
    }
    .ti-new-tag-input-wrapper {
      display: flex;
      flex: 1 0 auto;
      padding: 3px 5px;
      margin: 2px;
      font-size: .85em;
      outline: none;
    }
    .hide-input {
      border: none;
    }
  }
  .btn-delete {
    height: 36px;
  }
}
</style>
