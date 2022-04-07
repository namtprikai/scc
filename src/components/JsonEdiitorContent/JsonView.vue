<template>
  <div class="json-view-main">
    <div class="block_content">
      <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
        <div
          v-for="(item, index) in flowData"
          :key="`${item.type}${index}`"
          :class="[
            'block',
            'block--custom',
            'clearfix',
            {'hide-block': hideMyBlock[index] === true}
          ]"
        >
          <span class="json-key">
            <input
              type="text"
              v-model="item.name"
              class="key-input"
              v-if="typeof item.name === 'string'"
              @blur="keyInputBlur(item, $event)"
            />
            <i
              class="collapse-down v-json-edit-icon-arrow_drop_down"
              v-if="item.type === 'object' || item.type === 'array'"
              @click="closeBlock(index, $event)"
            ></i>
            <i v-if="item.type === 'object'" class="i-type">{{
              "{" + item.childParams.length + "}"
            }}</i>
            <i v-if="item.type === 'array'" class="i-type">{{
              "[" + item.childParams.length + "]"
            }}</i>
          </span>
          <span class="json-val">
            <template v-if="item.type === 'object'">
              <json-view
                :parsedData="item.childParams"
                v-model="item.childParams"
              ></json-view>
            </template>

            <template v-else-if="item.type === 'array'">
              <array-view
                :parsedData="item.childParams"
                v-model="item.childParams"
              ></array-view>
            </template>

            <template v-else>
              <span class="val">
                <input
                  type="text"
                  v-model="item.remark"
                  class="val-input"
                  v-if="item.type === 'string'"
                />
                <input
                  type="number"
                  v-model.number="item.remark"
                  class="val-input"
                  v-if="item.type === 'number'"
                  @input="numberInputChange(item)"
                />
                <select
                  name="value"
                  v-model="item.remark"
                  class="val-input"
                  v-if="item.type === 'boolean'"
                >
                  <option :value="true">true</option>
                  <option :value="false">false</option>
                </select>
              </span>
            </template>
          </span>
          <div class="tools">
            <select
              v-model="item.type"
              class="tools-types select--modifier"
              @change="itemTypeChange(item)"
            >
              <option
                v-for="(type, index) in formats"
                :value="type"
                :key="index"
              >
                {{ type }}
              </option>
            </select>
            <i class="dragbar v-json-edit-icon-drag"></i>
            <i class="del-btn" @click="delItem(parsedData, item, index)">
              <i class="v-json-edit-icon-huishouzhan_huaban"></i>
            </i>
          </div>
        </div>
      </draggable>

      <item-add-form
        v-if="toAddItem"
        @confirm="newItem"
        @cancel="cancelNewItem"
      ></item-add-form>

      <div class="block add-key" @click="addItem" v-if="!toAddItem">
        <i class="v-json-edit-icon-add"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Draggable from 'vuedraggable'
import ItemAddForm from './ItemAddForm.vue'
import ArrayView from './ArrayView.vue'

@Component({
  name: 'JsonView',
  components: {
    ItemAddForm,
    ArrayView,
    Draggable
  }
})

export default class extends Vue {
  @Prop({ default: () => [] }) private parsedData!: any[];
  formats = ['string', 'array', 'object', 'number', 'boolean'];
  flowData = this.parsedData;
  toAddItem = false;
  hideMyBlock: any = {};
  created() {
    this.flowData = this.parsedData || {}
  }

  @Watch('parsedData')
  // eslint-disable-next-line
  handler(_newValue: any, _oldValue: any): any {
    this.flowData = this.parsedData
  }

  delItem(parentDom: any, item: any, index: any) {
    this.flowData.splice(index, 1)
    if (this.hideMyBlock[index]) this.hideMyBlock[index] = false
    this.$emit('input', this.flowData)
  }
  // eslint-disable-next-line
  closeBlock(index: any, _e: any) {
    this.$set(this.hideMyBlock, index, !this.hideMyBlock[index])
  }

  addItem() {
    this.toAddItem = true
  }

  cancelNewItem() {
    this.toAddItem = false
  }

  newItem(obj: any | any[]) {
    const oj = {
      name: obj.key,
      type: obj.type,
      childParams: null,
      remark: null
    }
    if (obj.type === 'array' || obj.type === 'object') {
      oj.childParams = obj.val
      oj.remark = null
    } else {
      oj.childParams = null
      oj.remark = obj.val
    }

    if (!oj.name) {
      this.$alert(this.$t('validError.required', { _field_: 'Name' }) as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'error',
        center: true
      })
    } else {
      this.flowData.push(oj)
      this.$emit('input', this.flowData)
      this.cancelNewItem()
    }
  }

  keyInputBlur(item: any, e: any) {
    if (item.name.length <= 0) {
      this.$alert(this.$t('validError.required', { _field_: 'Name' }) as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'error',
        center: true
      })
      item.name = 'null'
      e.target.focus()
    }
  }

  onDragEnd() {
    this.$emit('input', this.flowData)
  }

  itemTypeChange(item: any) {
    if (item.type === 'array' || item.type === 'object') {
      item.childParams = []
      item.remark = null
    }
    if (item.type === 'boolean') {
      item.remark = true
    }
    if (item.type === 'string') {
      item.remark = ''
    }
    if (item.type === 'number') {
      item.remark = 0
    }
  }

  numberInputChange(item: any) {
    if (!item.remark) item.remark = 0
  }
}
</script>

 <style lang="scss" scoped>
    @import "./assets/styles/common.scss";
    json-editor {
      .block_content{
        .add-form select,
        .add-form input {
          // -webkit-appearance: none;
          background-color: #FFFFFF;
          background-image: none;
          border-radius: 4px;
          border: 1px solid #DCDFE6;
          box-sizing: border-box;
          color: #1f2d3d;
          display: inline-block;
          font-size: inherit;
          height: 30px;
          line-height: 30px;
          outline: none;
          padding: 0 15px;
          transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }
      ::v-deep select.select--modifier {
        background-color: #FFFFFF;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        box-sizing: border-box;
        color: #1f2d3d;
        display: inline-block;
        font-size: inherit;
        height: 30px;
        line-height: 30px;
        outline: none;
        padding: 0 15px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      .block--custom {
        margin-bottom: 5px;
      }
</style>
