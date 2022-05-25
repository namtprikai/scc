<template>
    <div class="tree">
        <div v-if="title" class="title">{{ title }}</div>
        <div class="tree-list">
            <ul class="tree-ul">
                <condition-tree v-if="renderConditionTree"
                    :data="treeData"
                    :isAction="isAction"
                    @addCondition="addCondition"
                    @handleDialogEdit="handleDialogEdit"
                    @deleteConditionGroup="deleteConditionGroup"
                />
            </ul>
        </div>
        <condition-dialog
            :dialogVisible.sync="confirmdialogVisible"
            :conditionEdit="conditionEdit"
            :title="$t('text.directEditConditionGroupTitle')"
            @ok="editCondition"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ConditionTree from './ConditionTree.vue'
import ConditionDialog from '@/components/Dialog/ConditionDialog.vue'

@Component({
  name: 'Tree',
  components: {
    ConditionTree,
    ConditionDialog
  }
})
export default class extends Vue {
    @Prop({ default: () => null }) public treeData!: any
    @Prop({ default: () => null }) public title!: string
    @Prop({ default: () => false }) public isAction!: boolean

    confirmdialogVisible = false
    conditionEdit = {
      id: null,
      text: null,
      config: {}
    }

    // Re render Tree
    renderConditionTree = true

    // Recursive get condition group
    recursiveGetConditionGroup(this: any, data: any, conditionGroupId: any) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].conditionGroup && data[i].conditionGroup.id === conditionGroupId) {
          return data[i].conditionGroup
        } else if (data[i].conditionGroup) {
          if (data[i].conditionGroup.conditions) {
            this.recursiveGetConditionGroup(data[i].conditionGroup.conditions, conditionGroupId)
          }
        } else {
          continue
        }
      }
    }

    // Get condition group
    getCoditionGroup(id: any) {
      if (this.treeData.id === id) {
        return this.treeData
      } else {
        return this.recursiveGetConditionGroup(this.treeData.conditions, id)
      }
    }

    // Get condition to delete condition group
    getCondition(this: any, data: any, id: any) {
      for (let i = 0; i < data.conditions.length; i++) {
        if (data.conditions[i].id === id) {
          return data.conditions[i]
        }
        if (data.conditions[i].conditionGroup) {
          this.getCondition(data.conditions[i].conditionGroup, id)
        }
      }
    }

    // Get condition
    handleDialogEdit(id: any) {
      const conditionResult: any = this.getCoditionGroup(id)
      if (conditionResult) {
        this.conditionEdit.id = conditionResult.id
        this.conditionEdit.text = conditionResult.text
        if (conditionResult.config) {
          this.conditionEdit.config = conditionResult.config
        } else {
          this.conditionEdit.config = {}
        }
        this.confirmdialogVisible = true
      }
    }

    // Add condition
    addCondition(conditionGroupId: any) {
      const ConditionGroup = this.getCoditionGroup(conditionGroupId)
      ConditionGroup.conditions.push({ id: ConditionGroup.conditions[ConditionGroup.conditions.length - 1].id + '.1', text: 'New Condition', isEdit: true })
    }

    // Edit condition group
    editCondition(condition: any) {
      const Conditions = this.getCoditionGroup(condition.id)
      Conditions.text = condition.text
      Conditions.config = condition.config
      Conditions.isEdit = true
      this.reRenderTree()
    }

    // Delete condition group
    deleteConditionGroup(idParent: any) {
      if (idParent) {
        this.$confirm(this.$tc('helpText.conditionGroupDeleteConfirm'),
          {
            confirmButtonText: this.$tc('text.ok'),
            cancelButtonText: this.$tc('text.cancel'),
            type: 'warning'
          })
          .then(async() => {
            const conditionHandle = this.getCondition(this.treeData, idParent)
            delete conditionHandle.conditionGroup
            this.reRenderTree()
          })
      }
    }

    // Handle re render component
    reRenderTree() {
      this.renderConditionTree = false
      this.$nextTick(() => {
        this.renderConditionTree = true
      })
    }
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
