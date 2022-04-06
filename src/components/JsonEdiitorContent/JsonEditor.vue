<template>
  <json-view :parsedData="parsedData" v-model="parsedData"></json-view>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import JsonView from './JsonView.vue'
import { cloneDeep } from 'lodash'

@Component({
  name: 'JsonEditor',
  components: {
    JsonView
  }
})
export default class extends Vue {
  @Prop({ type: [Object, Array], required: true }) private objData: any;
  parsedData: any = [];
  wrapperType = 'object';
  lastParsedData = {};

  created() {
    this.lastParsedData = {}
    this.parsedData = this.jsonParse(this.objData)
  }

  // eslint-disable-next-line
  @Watch('objData') handleObjData(newValue: any, oldValue:any){
    this.parsedData = this.jsonParse(this.objData)
  }

  // eslint-disable-next-line
  @Watch('parsedData') handleParsedData(newValue: any, oldValue:any){
    if (JSON.stringify(newValue) === JSON.stringify(this.lastParsedData)) {
      return
    }

    this.lastParsedData = cloneDeep(newValue)
    this.$emit('input', this.makeJson(this.parsedData))
  }

  jsonParse(jsonStr: any) {
    const parseJson = (json: any) => {
      const result: any = []
      const keys = Object.keys(json)
      // eslint-disable-next-line
      keys.forEach((k, _index) => {
        const val = json[k]
        let parsedVal = val

        if (this.getType(val) === 'object') {
          parsedVal = parseJson(val)
        } else if (this.getType(val) === 'array') {
          parsedVal = parseArray(val)
        }

        const opt = {
          name: k,
          type: this.getType(val),
          childParams: null,
          remark: null
        }

        if (opt.type === 'array' || opt.type === 'object') {
          opt.childParams = parsedVal
          opt.remark = null
        } else {
          opt.childParams = null
          opt.remark = parsedVal
        }

        result.push(opt)
      })
      return result
    }

    //
    const parseArray = (arrayObj: any) => {
      const result = []
      for (let i = 0; i < arrayObj.length; ++i) {
        const val = arrayObj[i]
        let parsedVal = val
        if (this.getType(val) === 'object') {
          parsedVal = parseJson(val)
        } else if (this.getType(val) === 'array') {
          parsedVal = parseArray(val)
        }

        const opt = {
          name: null,
          type: this.getType(val),
          childParams: null,
          remark: null
        }

        if (opt.type === 'array' || opt.type === 'object') {
          opt.childParams = parsedVal
          opt.remark = null
        } else {
          opt.childParams = null
          opt.remark = parsedVal
        }

        result.push(opt)
      }
      return result
    }

    // --
    const parseBody = (data: any) => {
      let r = null
      switch (this.getType(data)) {
        case 'array':
          this.wrapperType = 'array'
          r = parseArray(data)
          break
        case 'object':
          this.wrapperType = 'object'
          r = parseJson(data)
          break
      }
      return r
    }

    return parseBody(jsonStr)
  }

  getType(obj: any) {
    switch (Object.prototype.toString.call(obj)) {
      case '[object Array]':
        return 'array'
      case '[object Object]':
        return 'object'
      case '[object Null]':
      case '[object Function]':
      case '[object Undefined]':
        return 'string'
      default:
        return typeof obj
    }
  }

  makeJson(dataArr: any) {
    const revertWithObj = (data: any) => {
      const r: any = {}
      for (let i = 0; i < data.length; ++i) {
        const el = data[i]
        // eslint-disable-next-line
        let key, val;
        // eslint-disable-next-line
        key = el.name;
        if (el.type === 'array') {
          val = revertWithArray(el.childParams)
        } else if (el.type === 'object') {
          val = revertWithObj(el.childParams)
        } else {
          val = el.remark
        }

        r[key] = val
      }
      return r
    }

    const revertWithArray = (data: any): any => {
      const arr = []
      for (let i = 0; i < data.length; ++i) {
        const el = data[i]
        let r
        if (el.type === 'array') {
          r = revertWithArray(el.childParams)
        } else if (el.type === 'object') {
          r = revertWithObj(el.childParams)
        } else {
          r = el.remark
        }

        arr.push(r)
      }
      return arr
    }

    const revertMain = (data: any) => {
      let r = null
      switch (this.wrapperType) {
        case 'array':
          r = revertWithArray(data)
          break
        case 'object':
          r = revertWithObj(data)
          break
      }
      return r
    }

    return revertMain(dataArr)
  }
}
</script>
