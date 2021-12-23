<template src="@/views/ticketTable/template.html"></template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Saiko } from "@/utils/saiko/index";
import TicketCompParent, {
	Ticket,
	TicketData,
	TicketGroup,
	Condition,
	EnquateTicket,
} from "@/views/ticketTable";
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
import TicketGrafh from "../../components/TicketSearch/index.vue";
import { AdminUserModule } from "@/store/modules/adminUser";
import { NoneString, conditionList, tableKeyList } from "../../config";
const noneString = NoneString || "なし";
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";

// @ts-ignore
// @ts-ignore
@Component({
	components: { TicketGrafh },
})
export default class TicketComp extends TicketCompParent {
	protected searchStatuses = [
		{ value: "open", text: "離脱" },
		// { value: "escalated", text: "直通" },
		{ value: "answered", text: "回答済み" },
		{ value: "scriptNotFound", text: "未収録" },
		{ value: "searchFailed", text: "検索失敗" },
		{ value: "re-search", text: "再検索" },
		// { value: "unsupported", text: "未対応" },
		{ value: "quit", text: "未完了" },
	];

	// @ts-ignore
	public async mounted() {
		this.$moment.lang("ja", {
			weekdays: ["日", "月", "火", "水", "木", "金", "土"],
		});
		await Saiko.init();
		// await AdminUserModule.getAdminUserList();
		// const adminList = AdminUserModule.AdminList;
		// for (const admin of adminList) {
		//   tantoCondition.checkList.push({
		//     value: [admin.name],
		//     label: admin.name,
		//     flg: false
		//   });
		// }
		// this.conditionList.push(tantoCondition);
	}

	/*
		離脱：open
未収録：searchNoScript
未完了：quit
回答閲覧中：answering
回答閲覧済み：answered
		*/
	public conditionList: Array<Condition> = conditionList;

	// protected searchStatuses = [
	//   { value: "open", text: "離脱" },
	//   // { value: "escalated", text: "直通" },
	//   { value: "answered", text: "回答済み" },
	//   { value: "scriptNotFound", text: "未収録" },
	//   { value: "searchFailed", text: "検索失敗" },
	//   { value: "re-search", text: "再検索" },
	//   // { value: "unsupported", text: "未対応" },
	//   { value: "quit", text: "未完了" }
	// ];
	public tableKeyList = tableKeyList;
	public ticketGroup = new TicketGroup(this.tableKeyList);
	public optionSearchFilter(ticket: Ticket): boolean {
		const data = ticket.getNativeData();

		return true;
	}
}
</script>
<style type="sass" lang="scss" src="@/views/ticketTable/style.scss"></style>
<style
	type="sass"
	scoped
	lang="scss"
	src="@/views/ticketTable/scopedStyle.scss"
></style>
