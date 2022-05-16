<template>
    <li class="condition-tree">
        <div :class="data.is_edit ? 'is-edit label' : 'label'">{{ data.text }}</div>
        <ul v-if="data.conditions && data.conditions.length">
            <conditionTree
                v-for="(condition, index) in data.conditions"
                :key="index"
                :data="condition"
            />
        </ul>
        <ul v-if="data.conditionGroup">
            <conditionTree
                :data="data.conditionGroup"
            />
        </ul>
    </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'ConditionTree',
  components: {}
})
export default class extends Vue {
    @Prop({ default: () => null }) public data!: object
}
</script>

<style lang="scss" scoped>
li {
    ul {
        list-style: none;
    }
    .label {
        min-height: 30px;
        width: 100%;
        border: 1px solid #999;
        line-height: 28px;
        margin-bottom: 10px;
        padding: 0 10px;
    }
    .is-edit {
        border: 1px solid #ff4949;
    }
}
</style>
