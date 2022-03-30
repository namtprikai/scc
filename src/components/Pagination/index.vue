<template>
  <div
    :class="{'hidden': hidden}"
    class="pagination-container"
  >
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count.sync="pagerCount"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
// import { scrollTo } from '@/utils/scroll-to'

@Component({
  name: 'Pagination'
})
export default class extends Vue {
  @Prop({ required: true }) private total!: number
  @Prop({ default: 1 }) private page!: number
  @Prop({ default: 20 }) private limit!: number

  @Prop({ default: () => [10, 20, 30, 50] }) private pageSizes!: number[]
  @Prop({ default: 'total, sizes, prev, pager, next, jumper' }) private layout!: string
  @Prop({ default: true }) private background!: boolean
  @Prop({ default: true }) private autoScroll!: boolean
  @Prop({ default: false }) private hidden!: boolean

  private pagerCount = 7
  private screenWidth = screen.width

  get currentPage() {
    return this.page
  }

  set currentPage(value) {
    this.$emit('update:page', value)
  }

  get pageSize() {
    return this.limit
  }

  set pageSize(value) {
    this.$emit('update:limit', value)
  }

  mounted() {
    window.addEventListener('resize', this.handleResize)
  }

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize() {
    this.screenWidth = screen.width
  }

  @Watch('screenWidth', { immediate: true })
  handleScreenSizeChange() {
    if (this.screenWidth < 600) {
      this.layout = 'total, sizes, prev, next'
      this.pagerCount = 5
    } else if (this.screenWidth < 768) {
      this.layout = 'total, sizes, prev, pager, next'
      this.pagerCount = 5
    } else if (screen.width < 992) {
      this.layout = 'total, sizes, prev, pager, next, jumper'
      this.pagerCount = 5
    } else {
      this.layout = 'total, sizes, prev, pager, next, jumper'
      this.pagerCount = 7
    }
  }

  handleSizeChange(value: number) {
    this.$emit('pagination', { page: this.currentPage, limit: value })
    // if (this.autoScroll) {
    //   scrollTo(0, 800)
    // }
  }

  handleCurrentChange(value: number) {
    this.$emit('pagination', { page: value, limit: this.pageSize })
    // if (this.autoScroll) {
    //   scrollTo(0, 800)
    // }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 0;
}

.pagination-container.hidden {
  display: none;
}
</style>
