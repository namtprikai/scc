<template>
    <div class="tree">
        <div v-if="title" class="title">{{ title }}</div>
        <div class="tree-list">
            <ul class="tree-ul">
                <conditionTree :data="treeData"/>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ConditionTree from './ConditionTree.vue'

@Component({
  name: 'Tree',
  components: {
    ConditionTree
  }
})
export default class extends Vue {
    @Prop({ default: () => null }) public treeData!: object
    @Prop({ default: () => null }) public title!: string
}
</script>

<style lang="scss" scoped>
.tree {
    border: 1px solid #999;
    border-radius: 5px;
    .tree-list {
        padding-right: 20px;
        max-height: 400px;
        overflow: auto;
    }
    .title {
        text-align: center;
        padding: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #999;
    }
    ul {
        list-style: none;
    }
}
</style>
