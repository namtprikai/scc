<template>
  <div class="direct-body-right border-box">
    <div class="header">Detail</div>
    <div class="body">
      <form-question :detailQuestion="detailQuestion" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormQuestion from './FormQuestion.vue'
import { IDetailQuestion } from '@/api/types/question'

@Component({
  name: 'Detail',
  components: {
    FormQuestion
  }
})
export default class extends Vue {
  @Prop({ default: null }) private detailQuestion!: IDetailQuestion;
}
</script>

<style lang="scss" scoped>
.direct-body-right {
  width: 58%;
  box-sizing: border-box;

  $blue: #409eff;

  .header {
    border-bottom: 1px solid #dcdfe6;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $blue;
    padding: 0 10px;
  }
}

.border-box {
  border: 1px solid #dcdfe6;
}
</style>
