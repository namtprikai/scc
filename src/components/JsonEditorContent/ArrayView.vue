<template>
  <div class="block_content array">
    <ol class="array-ol">
      <draggable v-model="flowData" handle=".dragbar" @end="onDragEnd">
        <li
          v-for="(member, index) in flowData"
          :key="`${member.type}${index}`"
          :class="['array-item', {'hide-item': hideMyItem[index] === true}]"
        >
          <p v-if="member.type !== 'object' && member.type !== 'array'">
            <input
              type="text"
              v-model="member.remark"
              class="val-input"
              v-if="member.type === 'string'"
              placeholder="string"
            />
            <input
              type="number"
              v-model.number="member.remark"
              class="val-input"
              v-if="member.type === 'number'"
              placeholder="number"
              @input="numberInputChange(member)"
            />
            <select
              name="value"
              v-model="member.remark"
              class="val-input"
              v-if="member.type === 'boolean'"
            >
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
          </p>
          <div v-else>
            <span :class="['json-key', 'json-desc']">
              {{ member.type.toUpperCase() }}
              <i
                class="collapse-down v-json-edit-icon-arrow_drop_down"
                v-if="member.type === 'object' || member.type === 'array'"
                @click="closeBlock(index, $event)"
              ></i>
              <i v-if="member.type === 'object'">{{
                "{" + member.childParams.length + "}"
              }}</i>
              <i v-if="member.type === 'array'">{{
                "[" + member.childParams.length + "]"
              }}</i>
            </span>

            <span class="json-val">
              <template v-if="member.type === 'array'">
                <array-view
                  :parsedData="member.childParams || []"
                  v-model="member.childParams"
                ></array-view>
              </template>

              <template v-if="member.type === 'object'">
                <json-view
                  :parsedData="member.childParams || {}"
                  v-model="member.childParams"
                ></json-view>
              </template>
            </span>
          </div>
          <div class="tools">
            <select
              v-model="member.type"
              class="tools-types"
              @change="itemTypeChange(member)"
            >
              <option
                v-for="(item, index) in formats"
                :value="item"
                :key="index"
              >
                {{ item }}
              </option>
            </select>
            <i class="dragbar v-json-edit-icon-drag"></i>
            <i class="del-btn" @click="delItem(parsedData, member, index)">
              <i class="v-json-edit-icon-huishouzhan_huaban"></i>
            </i>
          </div>
        </li>
      </draggable>
    </ol>

    <item-add-form
      v-if="toAddItem"
      @confirm="newItem"
      @cancel="cancelNewItem"
      :needName="false"
    ></item-add-form>

    <div class="block add-key" v-if="!toAddItem" @click="addItem">
      <i class="v-json-edit-icon-add"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Draggable from 'vuedraggable'
// import JsonView from './JsonView.vue'
import ItemAddForm from './ItemAddForm.vue'

@Component({
  name: 'ArrayView',
  components: {
    ItemAddForm,
    JsonView: () => import('./JsonView.vue'),
    Draggable
  }
})

export default class extends Vue {
  @Prop({ default: () => [] }) parsedData!: any[];
  formats = ['string', 'array', 'object', 'number', 'boolean'];
  flowData = this.parsedData;
  toAddItem = false;
  hideMyItem: any = {};

  @Watch('parsedData')
  // eslint-disable-next-line
  handler(_newValue: any, _oldValue: any) {
    this.flowData = this.parsedData || []
  }

  delItem(parentDom: any, item: any, index: any) {
    this.flowData.splice(index, 1)
    if (this.hideMyItem[index]) this.hideMyItem[index] = false
    this.$emit('input', this.flowData)
  }

  addItem() {
    this.toAddItem = true
  }

  cancelNewItem() {
    this.toAddItem = false
  }
  // eslint-disable-next-line
  closeBlock(index: any, _e: any) {
    this.$set(this.hideMyItem, index, !this.hideMyItem[index])
  }

  newItem(obj: any) {
    this.toAddItem = false

    const oj = {
      name: obj.key,
      type: obj.type,
      childParams: [],
      remark: null
    }
    if (obj.type === 'array' || obj.type === 'object') {
      oj.childParams = obj.val
      oj.remark = null
    } else {
      oj.childParams = []
      oj.remark = obj.val
    }

    this.flowData.push(oj)
    this.$emit('input', this.flowData)
    this.cancelNewItem()
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
    .json-editor {
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
        outline: none;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }

      .block--custom {
        margin-bottom: 5px;
      }

      select.tools-types {
        background-color: #FFFFFF;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        box-sizing: border-box;
        color: #1f2d3d;
        outline: none;
      }
</style>
