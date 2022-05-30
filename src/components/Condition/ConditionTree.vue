<template>
    <li class="condition-tree">
        <div :class="data.isEdit ? 'is-edit label' : 'label'">
            <span class="text-label">
                {{ data.text }}
            </span>
            <span v-if="isAction" class="action">
                <el-dropdown v-if="(data.conditions && data.conditions.length)  || data.level" trigger="click">
                    <span class="el-dropdown-link el-icon-more hover"/>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="data.conditions" class="button-top-dropdown">
                            <el-button type="text" @click="addCondition(data.id)" class="button-full-width">{{ $t('text.directEditAddCondition') }}</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="handleDialogEdit(data.id)" class="button-full-width">{{ $t('text.modify') }}</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="parentId">
                            <el-button type="text" @click="deleteConditionGroup(parentId)" class="button-full-width">{{ $t('text.delete') }}</el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown v-else trigger="click">
                    <span class="el-dropdown-link el-icon-more hover"/>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-button type="text">{{ $t('text.modify') }}</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="parentId">
                            <el-button type="text">{{ $t('text.delete') }}</el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
        </div>
        <ul v-if="(data.conditions && data.conditions.length)  || data.level">
            <condition-tree
                v-for="(condition, index) in data.conditions"
                :key="index"
                :data="condition"
                :isAction="isAction"
                :parentId="data.id"
                @addCondition="addCondition"
                @handleDialogEdit="handleDialogEdit"
                @deleteConditionGroup="deleteConditionGroup"
            ></condition-tree>
        </ul>
        <ul v-if="data.conditionGroup || typeof(data.level) === 'null'">
            <condition-tree
                :data="data.conditionGroup"
                :isAction="isAction"
                :parentId="data.id"
                @addCondition="addCondition"
                @handleDialogEdit="handleDialogEdit"
                @deleteConditionGroup="deleteConditionGroup"
            ></condition-tree>
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
    @Prop({ default: () => false }) public isAction!: boolean
    @Prop({ default: () => false }) public dialogVisible!: boolean
    @Prop({ default: () => null }) public parentId!: any

    addCondition(id: any) {
      this.$emit('addCondition', id)
    }

    handleDialogEdit(id: any) {
      this.$emit('handleDialogEdit', id)
    }

    deleteConditionGroup(idParent: any) {
      this.$emit('deleteConditionGroup', idParent)
    }
}
</script>

<style lang="scss" scoped>
.condition-tree {
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
        display: flex;
        justify-content: space-between;
        .hover {
            cursor: pointer;
        }
    }
    .is-edit {
        border: 1px solid #ff4949;
    }
}
.button-top-dropdown {
    border-bottom: 1px solid #999 !important;
}
.button-full-width {
    width: 100% !important;
    text-align: left;
}
</style>
