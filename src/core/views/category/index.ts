import { Component, Vue } from "vue-property-decorator";

import { mapGetters } from "vuex";
import { eventHub } from "@/init/eventHub";
import { v4 } from "uuid";
import { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import { AjaxService } from "@/services/ajax";
import { QuestionModule } from "@/store/modules/question";

import WrapSppiner from "@/components/WrapSinner/index.vue";
import { BCardAccordion } from "@/components/BCardAccodion";
import { ProductsModule } from "@/store/modules/products";
import { IQuestionData } from "@/api/types";
import CategoryComp from "@/components/Category/Category.vue";
@Component({
	components: { CategoryComp},
})
export default class CategoryParent extends Vue {

}
