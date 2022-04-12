<template>
  <div class="add-form pure-form">
    <div class="f-input">
      <input
        type="text"
        v-model="keyName"
        v-if="needName"
        class="f-input-m"
        :placeholder="$t('labelText.jsonKeyName')"
      />
      <select v-model="formatSelected" class="f-input-m">
        <option v-for="(item, index) in formats" :value="item" :key="index">
          {{ item }}
        </option>
      </select>
      <span class="f-input-m">
        <b>:</b>
      </span>

      <template
        v-if="formatSelected !== 'array' && formatSelected !== 'object'"
      >
        <input
          type="text"
          v-model="valName"
          class="f-input-m"
          :placeholder="$t('labelText.jsonValueName')"
          v-if="formatSelected === 'string'"
        />
        <input
          type="number"
          v-model="valName"
          class="f-input-m"
          :placeholder="$t('labelText.jsonValueName')"
          v-if="formatSelected === 'number'"
          @change="dealNumber"
        />
        <select
          name="value"
          v-model="valName"
          class="f-input-m"
          v-if="formatSelected === 'boolean'"
          @change="dealBoolean"
        >
          <option :value="true">true</option>
          <option :value="false">false</option>
        </select>
      </template>
    </div>

    <div class="f-btns">
      <el-button type="primary" class="primary" @click.native.prevent="confirm" tabindex="5">{{
        $t("text.ok")
      }}</el-button>
      <button class="pure-button" @click="cancel">
        {{ $t("text.cancel") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ItemAddForm'
})

export default class extends Vue {
  @Prop({ default: true }) private needName!: boolean;
  formats = ['string', 'array', 'object', 'number', 'boolean'];
  formatSelected = 'string';
  keyName: any = '';
  valName: any = '';
  confirm() {
    let val = null
    if (this.formatSelected === 'array' || this.formatSelected === 'object') {
      val = []
    } else {
      val = this.valName
    }

    const objData = {
      key: this.needName ? this.keyName : null,
      val: val,
      type: this.formatSelected
    }

    this.$emit('confirm', objData)
    this.keyName = ''
    this.valName = ''
    this.formatSelected = 'string'
  }

  cancel() {
    this.$emit('cancel')
  }

  dealBoolean() {
    this.valName = Boolean(this.valName)
  }

  dealNumber() {
    this.valName = Number(this.valName)
  }
}
</script>

<style lang="scss" scoped>
 @import "./assets/styles/common.scss";
.f-input,
.f-btns {
  display: inline-block;
}

.f-btns {
  display: inline-block;
  margin-top: 0.5em;
}

.f-confirm {
  color: #fff;
  background: #05a5d1;
}

.add-form {
  margin-bottom: 20px;
  font-size: 0.6em;
}

.json-editor {
  .block_content {
    .add-form {
      ::v-deep select,
      ::v-deep input {
        // -webkit-appearance: none;
        background-color: #ffffff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
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

      button {
        height: auto;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-color: #dcdfe6;
        color: #1f2d3d;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: 0.1s;
        font-weight: 400;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 8px 12px;
        font-size: 14px;
        border-radius: 4px;
        margin-right: 5px;
      }

      button.primary {
        color: #FFFFFF;
        background-color: #1890ff;
        border-color: #1890ff;
      }
    }
  }
}
</style>
