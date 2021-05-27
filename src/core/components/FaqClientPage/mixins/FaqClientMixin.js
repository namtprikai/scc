import Vue from 'vue'
import Component from 'vue-class-component'

// @ts-ignore
@Component({
	props: {
		navigationStore: Object,
		autocompleteStore: Object,
		historyStore: Object,
	},
})
export default class FaqClientMixin extends Vue {}
