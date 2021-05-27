<template>
	<div class="ticket-analyzer">
		<TabHeader>
			<b-button
				variant="primary"
				class="ml-2"
				size="sm"
				@click="search()"
				:disabled="!canSearch"
				>検索</b-button
			>
			<b-button
				class="ml-2"
				size="sm"
				@click="csvDownload()"
				:disabled="Tickets && !(Tickets.length > 0)"
				>CSVダウンロード</b-button
			>
		</TabHeader>
		<div class="tab-body">
			<b-alert show variant="info" v-if="discription">
				<span
					class="text-discription __Info"
					v-html="$sanitize(discription)"
				></span>
			</b-alert>
			<div class>
				<div class="section">
					<b-card-group deck>
						<PeriodSettingWidget
							class
							:start_time.sync="StartDate"
							:end_time.sync="EndDate"
							:c_start_time.sync="CStartDate"
							:c_end_time.sync="CEndDate"
							init
						/>
						<SelectionSettingWidget
							class
							title="ステータス"
							:list="searchStatusesList"
							:select.sync="searchStatusesSelectItems"
							all
							two
						/>
						<!-- <SelectionSettingWidget

				class="ticket-analyzer_widget widget widget-s"
				title="発行元"
				:list="issuerStatusesList"
				:select.sync="issuerStatusesSelectItems"
			/>
			<SelectionSettingWidget
				class="ticket-analyzer_widget widget widget-s"
				title="担当者"

						/>-->
					</b-card-group>
				</div>
			</div>
			<div class="section text-center">
				<b-button
					class
					variant="primary"
					size="lg"
					@click="search()"
					:disabled="!canSearch"
					>検索</b-button
				>
			</div>
			<div v-if="Tickets == null" class="ticket-analyzer_resultpanel-else">
				検索を開始してください
			</div>
			<b-alert show variant="warning" v-if="Tickets && Tickets.length == 0">
				<span class="text-discription __Warning"
					>指定された集計対象期間に利用履歴が存在しません。利用履歴が存在する期間を指定してください。</span
				>
			</b-alert>
			<el-tabs type="border-card" v-if="Tickets && Tickets.length > 0">
				<el-tab-pane label="集計結果グラフ">
					<!-- <TicketAnalyzeGraph :graph-data="GraphData" /> -->
					<ticket-grafh :tickets="ticketGroup.keyData"></ticket-grafh>
				</el-tab-pane>
				<el-tab-pane label="集計結果表-1">
					<AggregateResultsTableMain
						:ts="TalkScript"
						:tickets="Tickets"
						:ctickets="CTickets"
						@update="saveMainTableRows"
					/>
				</el-tab-pane>
				<el-tab-pane label="集計結果表-2">
					<AggregateResultsTableSub
						:ts="TalkScript"
						:tickets="Tickets"
						:ctickets="CTickets"
						tableWidth="100%"
						@update="saveSubTableRows"
					/>
				</el-tab-pane>
				<el-tab-pane label="チケット一覧">
					<vue-good-table
						:columns="tableTicketColumns"
						:rows="Tickets"
						:sort-options="{
							enabled: true,
							initialSortBy: { field: 'start_time', type: 'asc' },
						}"
						:pagination-options="{
							enabled: true,
							perPage: 15,
							perPageDropdown: [10, 15, 30, 50],
							rowsPerPageLabel: '表示件数',
							mode: 'pages',
						}"
					>
						<template slot="table-row" slot-scope="props">
							<div
								v-if="
									props.column.field === 'enquete_resolved' &&
									props.row[props.column.field]
								"
							>
								<div :id="`enquete-${props.index}`">表示</div>
								<b-popover
									:target="`enquete-${props.index}`"
									class="ticket-analyzer_table-popover"
									triggers="hover"
									placement="bottom"
								>
									<template v-slot:title>アンケート</template>
									<ol class="table-popover_list">
										<li
											class="table-popover_list-item"
											v-for="key in Object.keys(props.row[props.column.field])"
											:key="key"
										>
											<div
												class="table-popover_list-item__wrapper"
												v-if="props.row[props.column.field][key] !== undefined"
											>
												<div
													class="table-popover_list-item__label"
													v-if="'label' in props.row[props.column.field][key]"
												>
													{{ props.row[props.column.field][key]["label"] }}
												</div>
												<div
													v-if="
														props.row[props.column.field][key]['type'] ===
														'textarea'
													"
													class="table-popover_list-item__value"
												>
													{{ props.row[props.column.field][key]["value"] }}
												</div>
												<div
													v-else-if="
														props.row[props.column.field][key]['type'] ===
														'radio'
													"
													class="table-popover_list-item__value"
												>
													{{
														props.row[props.column.field][key]["value"]["label"]
													}}
												</div>
												<ul
													v-else-if="
														props.row[props.column.field][key]['type'] ===
														'checkbox'
													"
													class="table-popover_list-item__values"
												>
													<li
														class="table-popover_list-item__value"
														v-for="(item, i) in props.row[props.column.field][
															key
														]['value']"
														:key="i"
													>
														{{ item["label"] }}
													</li>
												</ul>
												<div
													class="table-popover_list-item__value"
													v-else-if="
														props.row[props.column][key].hasOwnProperty('value')
													"
												>
													{{ props.row[props.column.field][key]["value"] }}
												</div>
											</div>
										</li>
									</ol>
								</b-popover>
							</div>
							<div
								v-else-if="
									props.column.field === 'enquete_unresolved' &&
									props.row[props.column.field]
								"
							>
								<div :id="`meyasu-${props.index}`">表示</div>
								<b-popover
									:target="`meyasu-${props.index}`"
									class="ticket-analyzer_table-popover"
									triggers="hover"
									placement="bottom"
								>
									<template v-slot:title>目安箱</template>
									<ol class="table-popover_list">
										<li
											class="table-popover_list-item"
											v-for="key in Object.keys(props.row[props.column.field])"
											:key="key"
										>
											<div
												class="table-popover_list-item__wrapper"
												v-if="props.row[props.column.field][key] !== undefined"
											>
												<div
													class="table-popover_list-item__label"
													v-if="'label' in props.row[props.column.field][key]"
												>
													{{ props.row[props.column.field][key]["label"] }}
												</div>
												<div
													v-if="
														props.row[props.column.field][key]['type'] ===
														'textarea'
													"
													class="table-popover_list-item__value"
												>
													{{ props.row[props.column.field][key]["value"] }}
												</div>
												<div
													v-else-if="
														props.row[props.column.field][key]['type'] ===
														'radio'
													"
													class="table-popover_list-item__value"
												>
													{{
														props.row[props.column.field][key]["value"]["label"]
													}}
												</div>
												<ul
													v-else-if="
														props.row[props.column.field][key]['type'] ===
														'checkbox'
													"
													class="table-popover_list-item__values"
												>
													<li
														class="table-popover_list-item__value"
														v-for="(item, i) in props.row[props.column.field][
															key
														]['value']"
														:key="i"
													>
														{{ item["label"] }}
													</li>
												</ul>
												<div
													class="table-popover_list-item__value"
													v-else-if="
														props.row[props.column][key].hasOwnProperty('value')
													"
												>
													{{ props.row[props.column.field][key]["value"] }}
												</div>
											</div>
										</li>
									</ol>
								</b-popover>
							</div>
							<span v-else>{{ props.formattedRow[props.column.field] }}</span>
						</template>
					</vue-good-table>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Ajax } from "@/utils/parts";
import { PRODUCT_ID, subsystemUrl } from "../../utils/configration";
import TicketGrafh from "../../components/TicketSearch/index.vue";
import {
	TalkScriptModule,
	TalkScript as ITalkScript,
} from "@/store/modules/talkScript";
import { valid } from "mockjs";
import {
	PeriodSettingWidget,
	SelectionSettingWidget,
	TicketAnalyzeGraph,
	AggregateResultsTableMain,
	AggregateResultsTableSub,
} from "../../components/TicketAnalyzer";
import any from "element-ui/lib/locale/lang/ja";
import { GraphData, BarData } from "../../components/TicketAnalyzer/index.i";
import { CSVFact, CSVFactPlus, ICSVHeader, ICSVHeaderItem } from "@/utils/csv";
import moment from "moment";
import _ from "lodash";
import graphFn from "./graph";
import jszip from "jszip";
import { ticketLabelsGenerator } from "@/store/modules/ticket";
import { EnquateMapper } from "@/components/TicketSearch";
import TicketCompParent, {
	Ticket,
	TicketData,
	TicketGroup,
	Condition,
	EnquateTicket,
} from "@/views/ticketTable";
import { Saiko } from "@/utils/saiko";
import { UserAgent } from "express-useragent";
import { TableKeyList, TagTicketData, TagSet } from "./index.i";
moment.locale("ja", {
	weekdays: [
		"日曜日",
		"月曜日",
		"火曜日",
		"水曜日",
		"木曜日",
		"金曜日",
		"土曜日",
	],
	weekdaysShort: ["日", "月", "火", "水", "木", "金", "土"],
	months: [
		"1月",
		"2月",
		"3月",
		"4月",
		"5月",
		"6月",
		"7月",
		"8月",
		"9月",
		"10月",
		"11月",
		"12月",
	],
});
const EnquateMap = (key: string, enquateKey: string) => (
	_enquate: EnquateTicket,
	ticket: any
) => {
	const enquate: EnquateTicket = ticket[enquateKey];
	if (enquate) {
		const ENQUATE_VALUE = enquate[key];
		if (
			!Array.isArray(enquate) &&
			typeof enquate === "object" &&
			ENQUATE_VALUE
		) {
			if (ENQUATE_VALUE.type === "radio") {
				if (ENQUATE_VALUE.value) {
					return ENQUATE_VALUE.value.label;
				}
			} else if (ENQUATE_VALUE.type === "checkbox") {
				if (Array.isArray(ENQUATE_VALUE.value)) {
					return ENQUATE_VALUE.value.map((e) => e.label);
				}
			} else if (ENQUATE_VALUE.type === "textarea") {
				if (TicketGroup.noneSt !== ENQUATE_VALUE.value) {
					return ENQUATE_VALUE.value;
				}
			}
		}
	}
	return TicketGroup.noneSt;
};
const EnquateGet = (key: string, enquateKey: string) => (
	_enquate: EnquateTicket,
	ticket: any
) => {
	const enquate: EnquateTicket = ticket[enquateKey];
	if (enquate) {
		const ENQUATE_VALUE = enquate[key];
		if (
			!Array.isArray(enquate) &&
			typeof enquate === "object" &&
			ENQUATE_VALUE
		) {
			if (ENQUATE_VALUE.type === "radio") {
				if (ENQUATE_VALUE.value) {
					return ENQUATE_VALUE.value.label;
				}
			} else if (ENQUATE_VALUE.type === "checkbox") {
				if (
					Array.isArray(ENQUATE_VALUE.value) &&
					ENQUATE_VALUE.value.length > 0
				) {
					return ENQUATE_VALUE.value.map((e) => e.label).join(", ");
				}
			} else if (ENQUATE_VALUE.type === "textarea") {
				if (TicketGroup.noneSt !== ENQUATE_VALUE.value) {
					return ENQUATE_VALUE.value;
				}
			}
		}
	}
	return noneString;
};
const noneString = "なし";
interface ITableTicketColumn {
	label: string;
	field: string;
	width?: string;
	valid?: Function;
	formatFn?: Function;
	sortFn?: Function;
	[key: string]: any;
}
interface ITableTicketRow {}
type Dictionary<T> = { [key: string]: T };
// @ts-ignore
@Component({
	name: "TicketAnalyzer",
	components: {
		PeriodSettingWidget,
		SelectionSettingWidget,
		TicketAnalyzeGraph,
		AggregateResultsTableMain,
		AggregateResultsTableSub,
		TicketGrafh,
	},
})
export default class TicketAnalyzer extends Vue {
	tableKeyList = [
		// {
		//   key: "mode",
		//   label: "応答モード",
		//   valueMapper: (value: string) => {
		//     const label: any = { bot: "BOT", operator: "有人" };
		//     return value && label[value];
		//   }
		// },
		// {
		//   key: "assignee",
		//   label: "対応者",
		//   valueMapper: (value: string) => {
		//     return value;
		//   }
		// },
		{
			key: "user_id",
			label: "ユーザーID",
			discription: "ユーザーのIDです",
			valueMapper: (value: string) => {
				return value;
			},
		},
		{
			key: "start_time",
			label: "開始日時",
			valid: (value: string) => {
				return !!String(value).match(/^\d+$/);
			},
			valueGetter: (value: string) => {
				return this.$moment(parseInt(value, 10)).format("YYYY/MM/DD HH:mm:ss");
			},
		},
		{
			key: "end_time",
			label: "完了日時",
			valid: (value: string) => {
				return true; //! !String(value).match(/^\d+$/);
			},
			valueGetter: (value: string, ticketData: TicketData) => {
				let endTime = value;
				if (!String(endTime).match(/^\d+$/)) {
					endTime = String(ticketData.start_time);
				}
				return this.$moment(parseInt(endTime, 10)).format(
					"YYYY/MM/DD HH:mm:ss"
				);
			},
		},
		{
			key: "duration",
			label: "対応時間",
			discription: "終了時間ー開始時間",
			valueMapper: (value: string, ticketData: TicketData) => {
				if (ticketData.status == "open") {
					return "-";
				}
				const startDate = String(
					ticketData.start_time || ticketData.start_time
				);
				let endDate = String(
					ticketData.end_time || ticketData.end_time || ticketData.start_time
				);
				if (!String(endDate).match(/^\d+$/)) {
					endDate = String(ticketData.start_time);
				}
				if (
					String(startDate).match(/^\d+$/) &&
					String(endDate).match(/^\d+$/)
				) {
					const diff = parseInt(endDate, 10) - parseInt(startDate, 10);
					return String(diff);
					// const duration = this.$moment.duration(diff);
					// let retStr = "";
					// if (retStr !== "" || duration.hours()) {
					//   retStr += duration.hours() + "時間";
					// }
					// if (retStr !== "" || duration.minutes()) {
					//   retStr += duration.minutes() + "分";
					// }
					// if (retStr !== "" || duration.seconds()) {
					//   retStr += duration.seconds() + "秒";
					// }
					// return retStr;
				}
				return "-";
			},
			valueGetter: (value: string) => {
				if (!/^\d+$/.test(value)) {
					return value;
				}
				const diff = parseInt(value);
				const duration = this.$moment.duration(diff);
				let retStr = "";
				if (retStr !== "" || duration.hours()) {
					retStr += duration.hours() + "時間";
				}
				if (retStr !== "" || duration.minutes()) {
					retStr += duration.minutes() + "分";
				}
				if (retStr !== "" || duration.seconds()) {
					retStr += duration.seconds() + "秒";
				}
				return retStr;
			},
		},
		{
			key: "end_time",
			label: "年",
			valueGetter: (value: string, ticketData: TicketData) => {
				let endTime = value;
				if (!String(endTime).match(/^\d+$/)) {
					endTime = String(ticketData.start_time);
				}
				return this.$moment(parseInt(endTime, 10)).format("YYYY");
			},
		},
		{
			key: "end_time",
			label: "月",
			valueGetter: (value: string, ticketData: TicketData) => {
				let endTime = value;
				if (!String(endTime).match(/^\d+$/)) {
					endTime = String(ticketData.start_time);
				}
				return this.$moment(parseInt(endTime, 10)).format("MM");
			},
		},
		{
			key: "end_time",
			label: "日",
			valueGetter: (value: string, ticketData: TicketData) => {
				let endTime = value;
				if (!String(endTime).match(/^\d+$/)) {
					endTime = String(ticketData.start_time);
				}
				return this.$moment(parseInt(endTime, 10)).format("DD");
			},
		},
		{
			key: "end_time",
			label: "曜日",
			valueGetter: (value: string, ticketData: TicketData) => {
				let endTime = value;
				if (!String(endTime).match(/^\d+$/)) {
					endTime = String(ticketData.start_time);
				}
				return this.$moment(parseInt(endTime, 10)).format("dddd");
			},
		},
		// {
		//   key: "mail_address",
		//   label: "メールアドレス",
		//   valueMapper: (value: string) => {
		//     return value;
		//   }
		// },
		// {
		//   key: "device",
		//   label: "デバイス",
		//   valueMapper: (value: string) => {
		//     return value;
		//   }
		// },
		// {
		//   key: "os_name",
		//   label: "OS",
		//   valueMapper: (value: string) => {
		//     return value;
		//   }
		// },
		// {
		//   key: "browser_name",
		//   label: "ブラウザ",
		//   valueMapper: (value: string) => {
		//     return value;
		//   }
		// },
		// {
		//   key: "origin",
		//   label: "発行元",
		//   valid: (value: string) => {
		//     // if (value == undefined) {
		//     //   return false;
		//     // }
		//     // return /^.+$/.test(value);
		//     return true;
		//   },
		//   valueMapper: (value: "window" | "console") => {
		//     if (value === "console") {
		//       return "管理画面";
		//     }
		//     return "ウィンドウ";
		//     // const mapper = {
		//     //   window: "ウィンドウ",
		//     //   console: "管理画面"
		//     // };
		//     // return mapper[value] || value;
		//   }
		// },
		{
			key: "status",
			label: "ステータス",
			valueMapper: (value: string) => {
				return (
					(this.searchStatuses[value]
						? this.searchStatuses[value].text
						: value) ?? ""
				);
			},
		},
		// {
		//   key: "log_faq_channel",
		//   label: "検索方法",
		//   valueMapper: (value: string) => {
		//     return Array.isArray(value)
		//       ? value
		//           .map(v => {
		//             const mapper: { [key: string]: string } = {
		//               category: "カテゴリー選択",
		//               search: "検索",
		//               frequent: "よくある質問"
		//             };
		//             return mapper[v] || v;
		//           })
		//           .join(",")
		//       : value;
		//   }
		// },

		{
			key: "log_faq_parent_category",
			label: "親カテゴリ",
			valueMapper: (value: Array<string>) => {
				return Array.isArray(value) ? value[value.length - 1] : value;
			},
		},
		{
			key: "log_faq_child_category",
			label: "子カテゴリ",
			valueMapper: (value: Array<string>) => {
				return Array.isArray(value) ? value[value.length - 1] : value;
			},
		},
		{
			key: "log_faq",
			label: "FAQ番号",
			valueMapper: (value: Array<string>) => {
				return Array.isArray(value) ? value[value.length - 1] : value;
			},
		},
		{
			key: "log_faq_title",
			label: "FAQタイトル",
			valueMapper: (value: Array<string>) => {
				return Array.isArray(value) ? value[value.length - 1] : value;
			},
		},
		{
			key: "query",
			label: "ユーザー入力文字",
			valueMapper: (value: string) => {
				if (value == "-") {
					return "";
				}
				return value;
			},
		},
		{
			key: "results",
			label: "レコメンド結果",
			valueMapper: (value: string) => {
				return Array.isArray(value) ? value.join(",") : value;
			},
		},

		{
			key: "log_scenario",
			label: "シナリオログ",
			valueMapper: (value: Array<string>) => {
				return Array.isArray(value) ? value[value.length - 1] : value;
			},
		},
		{
			key: "feedback",
			label: "フィードバック",
			valueMapper: (value: string) => {
				switch (value) {
					case "resolved":
						return "解決";
					case "unresolved":
						return "未解決";
				}
				return TicketGroup.noneSt;
			},
			valueGetter: (value: string) => {
				if (value == "-") {
					return noneString;
				}
				return value;
			},
		},
		// {
		//   key: "log_tag_id",
		//   label: "タグ番号",
		//   valueMapper: (value: Array<string>) => {
		//     return Array.isArray(value) ? value.join(",") : value;
		//   }
		// },
		// {
		//   key: "log_tag_name",
		//   label: "タグ表示名",
		//   valueMapper: (value: Array<string>) => {
		//     return Array.isArray(value) ? value.join(",") : value;
		//   }
		// },
		// {
		//   key: "enquete_resolved",
		//   label: "アンケート",
		//   valueGetter: (enquate: EnquateTicket) => {
		//     if (enquate && !Array.isArray(enquate) && typeof enquate === "object") {
		//       return Object.entries(enquate)
		//         .map(q => {
		//           const [key, value] = q;
		//           return `${value.label}:${JSON.stringify(value.value)}`;
		//         })
		//         .join("¥n");
		//     }
		//     return noneString;
		//   }
		// },
		// {
		//   key: "enquete_unresolved",
		//   label: "アンケート",
		//   valueGetter: (enquate: EnquateTicket) => {
		//     if (enquate && !Array.isArray(enquate) && typeof enquate === "object") {
		//       return Object.entries(enquate)
		//         .map(q => {
		//           const [key, value] = q;
		//           return `${value.label}:${JSON.stringify(value.value)}`;
		//         })
		//         .join("¥n");
		//     }
		//     return "なし";
		//   }
		// },
		{
			key: "enquete_resolved_1",
			nativeKey: "enquete_resolved",
			label: "アンケート1",
			valueMapper: EnquateMap("1", "enquete_resolved"),
			valueGetter: (value: string) => {
				if (value == "-") {
					return noneString;
				}
				return value;
			},
		},
		{
			key: "enquete_resolved_2",
			nativeKey: "enquete_resolved",
			label: "アンケート2",
			valueMapper: EnquateMap("2", "enquete_resolved"),
			valueGetter: EnquateGet("2", "enquete_resolved"),
		},

		{
			key: "enquete_resolved_3",
			nativeKey: "enquete_resolved",
			label: "アンケート3",
			valueMapper: EnquateMap("3", "enquete_resolved"),
			valueGetter: (value: string) => {
				if (value == "-") {
					return noneString;
				}
				return value;
			},
		},
		// {
		//   key: "enquete_resolved_free_entry_field_kanjo",
		//   label: "アンケート3感情",
		//   valueMapper: (_enquate: EnquateTicket, ticket: any) => {
		//     const emotionMapper: { [key: string]: string } = {
		//       happy: "喜び",
		//       sad: "悲しみ",
		//       disgust: "不快",
		//       angry: "怒り",
		//       fear: "恐怖",
		//       surprise: "驚き"
		//     };
		//     const enquate: EnquateTicket = ticket.enquete_resolved;
		//     if (
		//       enquate &&
		//       !Array.isArray(enquate) &&
		//       typeof enquate === "object" &&
		//       enquate.free_entry_field &&
		//       enquate.free_entry_field.type === "textarea"
		//     ) {
		//       if (TicketGroup.noneSt !== enquate.free_entry_field.value) {
		//         const kanjo = Saiko.mindSync(enquate.free_entry_field.value);
		//         if (kanjo !== null) {
		//           const kanjoString = Saiko.KanjoStringto(kanjo, 40);
		//           console.log(kanjo);
		//           if (kanjoString && kanjoString in emotionMapper) {
		//             return emotionMapper[kanjoString];
		//           } else {
		//             return "該当なし";
		//           }
		//         }
		//       }
		//     }
		//     return noneString;
		//   }
		// },
		{
			key: "enquete_unresolved_1",
			nativeKey: "enquete_unresolved",
			label: "目安箱1",
			valueMapper: EnquateMap("1", "enquete_unresolved"),
			valueGetter: EnquateGet("1", "enquete_unresolved"),
		},
		{
			key: "enquete_unresolved_2",
			nativeKey: "enquete_unresolved",
			label: "目安箱2",
			valueMapper: EnquateMap("2", "enquete_unresolved"),
			valueGetter: EnquateGet("2", "enquete_unresolved"),
		},
		{
			key: "enquete_unresolved_3",
			nativeKey: "enquete_unresolved",
			label: "目安箱3",
			valueMapper: EnquateMap("3", "enquete_unresolved"),
			valueGetter: EnquateGet("3", "enquete_unresolved"),
		},
		// {
		//   key: "enquete_unresolved_free_entry_field_kanjo",
		//   label: "目安箱3感情",
		//   valueMapper: (_enquate: EnquateTicket, ticket: any) => {
		//     const emotionMapper: { [key: string]: string } = {
		//       happy: "喜び",
		//       sad: "悲しみ",
		//       disgust: "不快",
		//       angry: "怒り",
		//       fear: "恐怖",
		//       surprise: "驚き"
		//     };
		//     const enquate: EnquateTicket = ticket.enquete_unresolved;
		//     if (
		//       enquate &&
		//       !Array.isArray(enquate) &&
		//       typeof enquate === "object" &&
		//       enquate.free_entry_field &&
		//       enquate.free_entry_field.type === "textarea"
		//     ) {
		//       if (TicketGroup.noneSt !== enquate.free_entry_field.value) {
		//         const kanjo = Saiko.mindSync(enquate.free_entry_field.value);
		//         if (kanjo !== null) {
		//           const kanjoString = Saiko.KanjoStringto(kanjo, 40);
		//           console.log(kanjo);
		//           if (kanjoString && kanjoString in emotionMapper) {
		//             return emotionMapper[kanjoString];
		//           } else {
		//             return "該当なし";
		//           }
		//         }
		//       }
		//     }
		//     return noneString;
		//   }
		// },

		// {
		//   key: "memo",
		//   label: "メモ",
		//   valueMapper: (value: Array<string>) => {
		//     return Array.isArray(value) ? value.join(",") : "なし";
		//   }
		// }
	];

	protected ajax: Ajax = new Ajax();
	protected StartDate = new Date();
	protected EndDate = new Date();
	protected CStartDate = new Date();
	protected CEndDate = new Date();
	@Prop({ default: "" })
	private discription?: string;

	public ticketGroup = new TicketGroup(this.tableKeyList);

	private get canSearch(): boolean {
		return (
			this.StartDate !== null &&
			this.EndDate !== null &&
			this.CStartDate !== null &&
			this.CEndDate !== null
		);
	}

	protected searchStatuses: Dictionary<{ value: string; text: string }> = {
		answered: { value: "answered", text: "回答済み" },
		answering: { value: "answering", text: "回答閲覧中" },
		searchFailed: { value: "searchFailed", text: "検索失敗" },
		searchNoScript: { value: "searchNoScript", text: "未収録" },
		quit: { value: "quit", text: "未完了" },
		"re-search": { value: "re-search", text: "再検索" },
		open: { value: "open", text: "離脱" },
	};

	protected get searchStatusesList() {
		return Object.values(this.searchStatuses);
	}

	protected searchStatusesSelectItems: string[] = [];

	protected issuerStatuses: Dictionary<{ value: string; text: string }> = {
		console: { value: "console", text: "管理画面" },
		window: { value: "window", text: "ウィンドウ" },
	};

	protected get issuerStatusesList() {
		return Object.values(this.issuerStatuses);
	}

	protected issuerStatusesSelectItem: string[] = [];

	protected feedbackStatuses: Dictionary<{ value: string; text: string }> = {
		resolved: { value: "resolved", text: "解決" },
		unresolved: { value: "unresolved", text: "未解決" },
	};

	private tableTicketColumns: ITableTicketColumn[] = [
    {
			label: "ユーザーID",
			field: "user_id",
			formatFn: (value: string) => {
				return value;
			},
			sortFn: (a: string, b: string) =>  0,
		},
		{
			label: "開始日時",
			field: "start_time",
			formatFn: (value: string) => {
				return moment(parseInt(value, 10)).format("YYYY/MM/DD HH:mm:ss");
			},
			sortFn: (a: Date, b: Date) => a.valueOf() - b.valueOf(),
		},
		{
			label: "親カテゴリ",
			field: "log_faq_parent_category",
			width: "10%",
			formatFn: (value: string[] | undefined) => {
				return (Array.isArray(value) ? value[value.length - 1] : value) ?? "";
			},
			sortFn: (a: string, b: string) => {
				const a1 = _(a).first() ?? "";
				const b1 = _(b).first() ?? "";
				return a1 === b1
					? 0
					: ((a: string, b: string) => {
							const s = [a, b].sort();
							return s[0] === a ? 1 : -1;
					  })(a1, b1);
			},
		},
		{
			label: "子カテゴリ",
			field: "log_faq_child_category",
			width: "10%",
			formatFn: (value: string[]) => {
				return (Array.isArray(value) ? value[value.length - 1] : value) ?? "";
			},
			sortFn: (a: string, b: string) => {
				const a1 = _(a).first() ?? "";
				const b1 = _(b).first() ?? "";
				return a1 === b1
					? 0
					: ((a: string, b: string) => {
							const s = [a, b].sort();
							return s[0] === a ? 1 : -1;
					  })(a1, b1);
			},
		},
		{
			label: "FAQタイトル",
			field: "log_faq_title",
			width: "15%",
			formatFn: (value: string[] | string) => {
				return (Array.isArray(value) ? value[value.length - 1] : value) ?? "";
			},
			sortFn: (a: string, b: string) => {
				const a1 =
					_(a)
						.keyBy((k) => k)
						.keys()
						.join(",") ?? "";
				const b1 =
					_(b)
						.keyBy((k) => k)
						.keys()
						.join(",") ?? "";
				return a1 === b1
					? 0
					: ((a: string, b: string) => {
							const s = [a, b].sort();
							return s[0] === a ? 1 : -1;
					  })(a1, b1);
			},
		},
		{
			label: "ユーザー入力文字",
			field: "query",
			width: "15%",
			formatFn: (value: string) => {
				return (value==="-"?"":value) || "";
			},
		},
		// {
		// 	label: "ユーザー入力文字履歴",
		// 	field: "history_query",
		// 	width: "15%",
		// 	formatFn: (value: Array<string>) => {
		// 		return Array.isArray(value) ? value.join(",") : "";
		// 	},
		// },
		{
			label: "タグ利用エリア",
			field: "history_action_faq_channel",
			width: "15%",
			formatFn: (value: Array<{ value: string; type: string }>) => {
				if (value) {
					const tagMapper: { [key: string]: string } = {
						list: "キーワード一覧",
						popular: "よくあるタグ",
						initial: "候補タグ",
					};
					for (let i = value.length - 1; i >= 0; i--) {
						if (value[i].type === "tag") {
							return tagMapper[value[i].value] || value[i].value;
						}
					}
				}
				return "";
			},
		},
		{
			label: "選択タグ",
			field: "tag_active_set",
			width: "15%",
			formatFn: (value: Array<TagSet> | "-") => {
				if (value == "-") {
					return "";
				}
				return Array.isArray(value)
					? value
							.map((v) => {
								return v.label || v.text;
							})
							.join(",")
					: value;
			},
		},
		{
			label: "ステータス",
			field: "status",
			formatFn: (value: string) => {
				return (
					(this.searchStatuses[value]
						? this.searchStatuses[value].text
						: value) ?? ""
				);
			},
		},
		{
			label: "フィードバック",
			field: "feedback",
			formatFn: (value: string) => {
				return (
					(this.feedbackStatuses[value]
						? this.feedbackStatuses[value].text
						: value) ?? ""
				);
			},
		},
		{
			label: "アンケート",
			field: "enquete_resolved",
			tdClass: "row_enquete-resolved",
			width: "60px",
			sortFn: (a: object | undefined, b: object | undefined) => {
				return a === undefined ? -1 : b === undefined ? 1 : 0;
			},
		},
		{
			label: "目安箱",
			field: "enquete_unresolved",
			tdClass: "row_enquete-unresolved",
			width: "60px",
			sortFn: (a: object | undefined, b: object | undefined) => {
				return a === undefined ? -1 : b === undefined ? 1 : 0;
			},
		},
	];

	private Tickets: any[] | null = null;
	private CTickets: any[] | null = [];

	private get TalkScript() {
		return TalkScriptModule.TalkScript ?? [];
	}

	private ticketLabels: any = {};
	private setTicketLabels(tickets: any[]) {
		this.ticketLabels = ticketLabelsGenerator(tickets);
	}

	private GraphData: GraphData[] = [];

	private async search() {
		const tickets = await this.getTickets(this.StartDate, this.EndDate);
		const ctickets = await this.getTickets(this.CStartDate, this.CEndDate);

		const filteredTickets = this.ticketsFilter(
			tickets,
			this.StartDate,
			this.EndDate
		);
		const filteredCTickets = this.ticketsFilter(
			ctickets,
			this.CStartDate,
			this.CEndDate
		);
		this.Tickets = filteredTickets ?? [];
		this.CTickets = filteredCTickets ?? [];
		if (Array.isArray(tickets)) {
			this.ticketGroup.setTicketList(_.cloneDeep(filteredTickets), (t) => {
				return true;
			});
			this.ticketGroup.setTableData();
			this.ticketGroup.setKeyData();
			// this.ticketList=ticketGroup.getTicketList();
		}
		this.GraphData = [
			{
				graph: "bar",
				title: "時間帯別チケット件数",
				unitText: "件",
				data: graphFn.getHourlyTicketCounts(this.Tickets),
				width: "50%",
			},
			{
				graph: "bar",
				title: "日別チケット件数",
				unitText: "件",
				data: graphFn.getDailyTicketCounts(
					this.Tickets,
					this.StartDate,
					this.EndDate
				),
				width: "50%",
			},
			{
				graph: "bar",
				title: "曜日別チケット件数",
				unitText: "件",
				data: graphFn.getWeeklyTicketCounts(this.Tickets),
				width: "50%",
			},
			{
				graph: "bar",
				title: "月別チケット件数",
				unitText: "件",
				data: graphFn.getMonthlyTicketCounts(this.Tickets),
				width: "50%",
			},
			{
				graph: "pie",
				title: "ステータス",
				unitText: "件",
				data: graphFn.getStatusCounts(this.Tickets, {
					answered: "回答済み",
					open: "離脱",
					searchNoScript: "未収録",
					quit: "離脱",
					searchFailed: "検索失敗",
					"re-search": "再検索",
				}),
				width: "50%",
			},
			{
				graph: "pie",
				title: "解決アンケート",
				unitText: "件",
				data: graphFn.getFeedbackCounts(this.Tickets, {
					resolved: "解決",
					unresolved: "未解決",
					undefined: "未選択",
				}),
				width: "50%",
			},
			{
				graph: "pareto",
				title: "FAQ別グラフ",
				unitText: "件",
				data: graphFn.getFaqCounts(this.Tickets),
				height: "800px",
				xLabelAll: "true",
			},
			{
				graph: "bar",
				title: "親カテゴリ別件数",
				unitText: "件",
				data: graphFn.getParentCategoryCounts(this.Tickets),
			},
			{
				graph: "bar",
				title: "子カテゴリ別件数",
				unitText: "件",
				data: graphFn.getChildCategoryCounts(this.Tickets),
			},
		];
		this.setTicketLabels(filteredTickets);
		console.log(
			"a",
			this.Tickets.filter((t) => t.enquete_resolved || t.enquete_unresolved)
		);
	}

	private async getTickets(startdate: Date, enddate: Date) {
		const startDateMoment = moment(startdate);
		const st = startDateMoment.format("YYYY-MM");
		const endDateMoment = moment(enddate).add(1, "month");
		const en = endDateMoment.format("YYYY-MM");
		const data: any = await this.ajax.http({
			baseURL: subsystemUrl,
			url: `product/${PRODUCT_ID}/data_get`,
			method: "get",
			params: { type: "ticket", en, st },
		});
		if (data.statusCode === 200) {
			if (data.message && data.message.length > 0) {
				return data.message;
			}
		}
		return [];
	}

	private ticketsFilter(tickets: any[], startdate: Date, enddata: Date) {
		const StartDate = startdate;
		const EndDate = moment(enddata).add(1, "day").toDate();
		tickets = tickets
			.filter((t) => {
				const s = parseInt(
					String(t.start_time || t.start_time || t.rangeKey) ?? 0,
					10
				);
				if (s < StartDate.getTime()) return false;
				if (s > EndDate.getTime()) return false;
				return true;
			})
			.filter((t) => {
				if (t.status) {
					const status: string = Array.isArray(t.status)
						? t.status[t.status.length - 1]
						: t.status;
					return this.searchStatusesSelectItems.includes(status);
				}
				return false;
			});
		return tickets;
	}

	private async created() {
		await Saiko.init();
		await TalkScriptModule.getTalkScript();
	}

	@Watch("TalkScript", { immediate: true })
	private updateTalkscript() {
		if (this.TalkScript && this.TalkScript.length > 0) {
			console.log(
				_(this.TalkScript)
					.chain()
					.filter((v) => v.type === "leaf")
					.value()
			);
		}
	}

	private MainTableRowGroup: Dictionary<any> = {};
	private SubTableRowGroup: Dictionary<any> = {};
	private saveMainTableRows(rowsGroup: Dictionary<any>) {
		this.MainTableRowGroup = rowsGroup;
	}

	private saveSubTableRows(rowsGroup: Dictionary<any>) {
		this.SubTableRowGroup = rowsGroup;
	}

	private csvFileNames: Dictionary<string> = {
		rawdata: "01_rawdata",
		log_faq_parent_category: "02_parent_category",
		log_faq_child_category: "03_child_category",
		log_faq_title: "04_question",
		status: "05_status",
		feedback: "06_feedback",
	};

	private rawDataHeader: ICSVHeader = [
		{ label: "ユーザーID", field: "user_id", type: "text" },
		{ label: "開始日時", field: "start_time", type: "text" },
		{ label: "終了日時", field: "end_time", type: "text" },
		{ label: "対応時間[秒]", field: "work_date", type: "text" },
		{ label: "年", field: "work_year", type: "number" },
		{ label: "月", field: "work_month", type: "number" },
		{ label: "日", field: "work_day", type: "number" },
		{ label: "曜日", field: "work_dow", type: "text" },
		{ label: "デバイス", field: "device", type: "text" },
		{ label: "OS", field: "os", type: "text" },
		{ label: "ブラウザ", field: "browser", type: "text" },
		{ label: "発行元", field: "origin", type: "text" },
		{ label: "検索方法", field: "history_action_faq_channel", type: "text" },
		{ label: "ステータス", field: "status", type: "text" },
		{ label: "FAQ番号", field: "log_faq", type: "text" },
		{ label: "シナリオログ", field: "log_scenario", type: "text" },
		{ label: "親カテゴリ", field: "log_faq_parent_category", type: "text" },
		{ label: "子カテゴリ", field: "log_faq_child_category", type: "text" },

		{ label: "FAQタイトル", field: "log_faq_title", type: "text" },
    { label: "ユーザー入力文字", field: "query", type: "text" },
    { label: "ユーザー入力文字履歴", field: "history_query", type: "text" },
		// { label: 'レコメンド結果', field: 'results', type: 'text' },

		{ label: "タグ利用エリア", field: "tagarea", type: "text" },
		{ label: "選択タグ", field: "tag_active_set", type: "text" },
		{ label: "選択タグ履歴", field: "tag_used_set", type: "text" },
		{ label: "フィードバック", field: "feedback", type: "text" },
		{ label: "アンケート1", field: "enquete_resolved1", type: "text" },
		{ label: "アンケート2", field: "enquete_resolved2", type: "text" },
		{ label: "アンケート3", field: "enquete_resolved3", type: "text" },
		{ label: "目安箱1", field: "enquete_unresolved1", type: "text" },
		{ label: "目安箱2", field: "enquete_unresolved2", type: "text" },
		{ label: "目安箱3", field: "enquete_unresolved3", type: "text" },
	];

	private mainTableHeader: ICSVHeader = [
		{ label: "タイトル", field: "title", type: "text" },
		{ label: "閲覧件数", field: "view_count", type: "number", index: 0 },
		{ label: "全体を占める割合", field: "view_count_per", type: "number" },
		{ label: "増減数", field: "view_count", type: "number", index: 1 },
		{ label: "増減率", field: "view_count_id", type: "number" },
		{ label: "解決数", field: "resolved_count", type: "number", index: 0 },
		{ label: "解決率", field: "resolved_per", type: "number" },
		{ label: "増減数", field: "resolved_count", type: "number", index: 1 },
		{ label: "増減率", field: "resolved_id", type: "number" },
		{
			label: "未解決数",
			field: "unresolved_count",
			type: "number",
			index: 0,
		},
		{ label: "未解決率", field: "unresolved_per", type: "number" },
		{ label: "増減数", field: "unresolved_count", type: "number", index: 1 },
		{ label: "増減率", field: "unresolved_id", type: "number" },
	];

	private subTableHeader: ICSVHeader = [
		{ label: "項目", field: "status", type: "text" },
		{ label: "件数", field: "count", type: "number", index: 0 },
		{ label: "全体を占める割合", field: "count_per", type: "number" },
		{ label: "増減数", field: "count", type: "number", index: 1 },
		{ label: "増減率", field: "count_id", type: "number" },
	];

	private csvDownload(): void {
		if (!(this.Tickets && this.Tickets.length > 0)) return;
		const csvData: { fileName: string; data: string }[] = [];

		// Raw Data
		const cfp = new CSVFactPlus(
			this.rawDataHeader,
			this.Tickets.map((t) => {
				let userAgent = null;
				let history_action_faq_channel = "";
				let tagarea = "";
				let tag_active_set = "";
				let tag_used_set = "";
				let history_query = "";
				let history_query_list = [];
				tag_active_set = Array.isArray(t.tag_active_set)
					? t.tag_active_set
							.map((v: any) => {
								return v.label || v.text;
							})
							.join(",")
					: t.tag_active_set;
				tag_used_set = Array.isArray(t.tag_used_set)
					? t.tag_used_set
							.map((v: any) => {
								return v.label || v.text;
							})
							.join(",")
					: t.tag_used_set;
				if (t.user_agent) {
					userAgent = new UserAgent().parse(t.user_agent);
				}
				if (Array.isArray(t.history_query)) {
					history_query = t.history_query[t.history_query.length - 1];
					history_query_list=t.history_query;
				}
				if (Array.isArray(t.history_action_faq_channel)) {
					const actions = t.history_action_faq_channel;
					if (actions) {
						const faqMapper: { [key: string]: string } = {
							frequent: "よくある質問",
							search: "検索",
							category: "カテゴリー選択",
							history: "最近見た質問",
							latest: "最近追加した質問",
							searchTop: "よく使われている質問",
						};
						for (let i = actions.length - 1; i >= 0; i--) {
							if (actions[i].type === "") {
								history_action_faq_channel =
									faqMapper[actions[i].value] || actions[i].value;
							}
						}
						const tagMapper: { [key: string]: string } = {
							list: "キーワード一覧",
							popular: "よくあるタグ",
							initial: "候補タグ",
						};
						for (let i = actions.length - 1; i >= 0; i--) {
							if (actions[i].type === "tag") {
								tagarea = tagMapper[actions[i].value] || actions[i].value;
							}
						}
					}
				}
				return {
					user_id: t.user_id,
					start_time: t.start_time
						? moment(parseInt(t.start_time, 10)).format("YYYY/MM/DD HH:mm:ss")
						: "-",
					end_time: t.end_time
						? moment(parseInt(t.end_time, 10)).format("YYYY/MM/DD HH:mm:ss")
						: t.start_time
						? moment(parseInt(t.start_time, 10)).format("YYYY/MM/DD HH:mm:ss")
						: "-",
					work_date: ((startDate, endDate) => {
						if (endDate == undefined) {
							return 0;
						}
						// const diffHours = moment(endDate).diff(moment(startDate), "hours") ?? 0;
						// const diffMinute =
						// 	moment(endDate).diff(moment(startDate), "minutes") - 60 * diffHours ?? 0;
						// const diffSecond =
						// 	moment(endDate).diff(moment(startDate), "seconds") -
						// 		3600 * diffHours -
						// 		60 * diffMinute ?? 0;
						// return `${diffHours !== 0 ? `${diffHours}時間` : ""}${
						// 	diffMinute !== 0 ? `${diffMinute}分` : ""
						// }${`${diffSecond}秒`}`;
						return moment(parseInt(endDate, 10)).diff(
							moment(parseInt(startDate, 10)),
							"seconds"
						);
					})(t.start_time, t.end_time),
					work_year: t.start_time
						? moment(parseInt(t.start_time, 10)).format("YYYY")
						: "-",
					work_month: t.start_time
						? moment(parseInt(t.start_time, 10)).format("MM")
						: "-",
					work_day: t.start_time
						? moment(parseInt(t.start_time, 10)).format("DD")
						: "-",
					work_dow: t.start_time
						? moment(parseInt(t.start_time, 10)).format("ddd")
						: "-",
					device: userAgent ? (userAgent.isMobile ? "sp" : "pc") : "-",
					os: userAgent ? userAgent.os : "-",
					browser: userAgent ? userAgent.browser : "-",
					origin: t.origin,
					history_action_faq_channel: history_action_faq_channel,
					status: this.searchStatuses[t.status]?.text,
					log_faq:
						(Array.isArray(t.log_faq)
							? t.log_faq[t.log_faq.length - 1]
							: t.log_faq) ?? "",
					log_scenario: Array.isArray(t.log_scenario)
						? t.log_scenario[t.log_scenario.length - 1]
						: t.log_scenario,
					log_faq_parent_category:
						(Array.isArray(t.log_faq_parent_category)
							? t.log_faq_parent_category[t.log_faq_parent_category.length - 1]
							: t.log_faq_parent_category) ?? "",
					log_faq_child_category:
						(Array.isArray(t.log_faq_child_category)
							? t.log_faq_child_category[t.log_faq_child_category.length - 1]
							: t.log_faq_child_category) ?? "",

					log_faq_title:
						(Array.isArray(t.log_faq_title)
							? t.log_faq_title[t.log_faq_title.length - 1]
							: t.log_faq_title) ?? "",
					query: t.query == "-" ? "" : t.query,
					history_query:history_query_list.join(","),
					tagarea: tagarea,
					tag_active_set: tag_active_set,
					tag_used_set: tag_used_set,
					feedback: ((f: string) => {
						switch (f) {
							case "resolved":
								return "解決";
							case "unresolved":
								return "未解決";
							default:
								return "";
						}
					})(t.feedback ?? ""),
					enquete_resolved1: ((enq: any, key: string) => {
						let value = "";
						if (enq && enq[key]) {
							switch (enq[key].type) {
								case "radio":
									value = enq[key]?.value?.label ?? "";
									break;
								case "checkbox":
									value = enq[key]?.value
										.map((v: any) => v?.label ?? "")
										.join(",");
									break;
								case "textarea":
									value = enq[key]?.value ?? "";
									break;
							}
						}
						return value;
					})(t.enquete_resolved, "1"),
					enquete_resolved2: ((enq: any, key: string) => {
						let value = "";
						if (enq && enq[key]) {
							switch (enq[key].type) {
								case "radio":
									value = enq[key]?.value?.label ?? "";
									break;
								case "checkbox":
									value = enq[key]?.value
										.map((v: any) => v?.label ?? "")
										.join(",");
									break;
								case "textarea":
									value = enq[key]?.value ?? "";
									break;
							}
						}
						return value;
					})(t.enquete_resolved, "2"),
					enquete_resolved3: ((enq: any, key: string) => {
						let value = "";
						if (enq && enq[key]) {
							switch (enq[key].type) {
								case "radio":
									value = enq[key]?.value?.label ?? "";
									break;
								case "checkbox":
									value = enq[key]?.value
										.map((v: any) => v?.label ?? "")
										.join(",");
									break;
								case "textarea":
									value = enq[key]?.value ?? "";
									break;
							}
						}
						return value;
					})(t.enquete_resolved, "3"),
					enquete_unresolved1: ((enq: any, key: string) => {
						let value = "";
						if (enq && enq[key]) {
							switch (enq[key].type) {
								case "radio":
									value = enq[key]?.value?.label ?? "";
									break;
								case "checkbox":
									value = enq[key]?.value
										.map((v: any) => v?.label ?? "")
										.join(",");
									break;
								case "textarea":
									value = enq[key]?.value ?? "";
									break;
							}
						}
						return value;
					})(t.enquete_unresolved, "1"),
					enquete_unresolved2: ((enq: any, key: string) => {
						let value = "";
						if (enq && enq[key]) {
							switch (enq[key].type) {
								case "radio":
									value = enq[key]?.value?.label ?? "";
									break;
								case "checkbox":
									value = enq[key]?.value
										.map((v: any) => v?.label ?? "")
										.join(",");
									break;
								case "textarea":
									value = enq[key]?.value ?? "";
									break;
							}
						}
						return value;
					})(t.enquete_unresolved, "2"),
					enquete_unresolved3: ((enq: any, key: string) => {
						let value = "";
						if (enq && enq[key]) {
							switch (enq[key].type) {
								case "radio":
									value = enq[key]?.value?.label ?? "";
									break;
								case "checkbox":
									value = enq[key]?.value
										.map((v: any) => v?.label ?? "")
										.join(",");
									break;
								case "textarea":
									value = enq[key]?.value ?? "";
									break;
							}
						}
						return value;
					})(t.enquete_unresolved, "3"),
				};
			})
		);
		csvData.push({
			fileName: this.csvFileNames.rawdata,
			data: cfp.getCSV(),
		});

		// MainTable
		for (const key in this.MainTableRowGroup) {
			const rows = this.MainTableRowGroup[key];
			const cfp = new CSVFactPlus(this.mainTableHeader, rows);
			csvData.push({ fileName: this.csvFileNames[key], data: cfp.getCSV() });
		}

		// SubTable
		for (const key in this.SubTableRowGroup) {
			const rows = this.SubTableRowGroup[key];
			console.log(rows);
			const cfp = new CSVFactPlus(this.subTableHeader, rows);
			csvData.push({ fileName: this.csvFileNames[key], data: cfp.getCSV() });
		}

		// zip圧縮 + Download
		const zip = new jszip();
    const currDate = new Date();
    const dateWithOffset = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60000);
		for (let i = 0; i < csvData.length; i++) {
			const item = csvData[i];
			zip.file(`${item.fileName}.csv`, `\ufeff${item.data}`, { date: dateWithOffset });
		}
		zip.generateAsync({ type: "blob" }).then((content) => {
			this.saveAs(content, `利用履歴_${moment().format("YYMMDD_HHmm")}.zip`);
		});
	}

	private saveAs(content: any, fileName: string) {
		const elm = document.createElement("a");
		const url = URL.createObjectURL(content);
		elm.href = url;
		elm.setAttribute("download", fileName);
		document.body.appendChild(elm);
		elm.click();
	}
}
</script>
<style lang="scss">
.popover {
	max-width: 50% !important;
}
.ticket-analyzer {
	.row_enquete-resolved,
	.row_enquete-unresolved {
		font-weight: 800;
		text-align: center;
	}
}
</style>
<style lang="scss" scoped>
.ticket-analyzer {
	&_controlpanel {
		&__buttons {
			width: 100%;
			& > button {
				display: inline-block;
				&:nth-child(n + 2) {
					margin-left: 16px;
				}
			}
		}
	}
	&_widgets {
		margin: 16px 0;
		background: #fff;
		// border: solid 1px #7b7b7b;
		border-radius: 3px;
		// margin: 32px;
		//box-shadow: 6px 6px 6px -3px #eaeaea;
	}
	&_widget {
		margin: 8px;
		&:nth-child(n) {
			border-right: solid 1px #dfdfdf;
		}
		&:last-child {
			border-right: 0;
		}
	}
	&_resultpanel-else {
		font-family: "Meiryo Bold";
		font-weight: 800;
		font-size: 32px;
		color: #9c9c9c;
		width: 100%;
		height: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	&_table-popover {
	}
}
.table-popover {
	&_list {
	}
	&_list-item {
		&:nth-child(n + 2) {
			margin-top: 16px;
		}
		&__label {
			font-size: 1.1rem;
		}
		&__values {
		}
		&__value {
		}
	}
}

$widget-background-color: #fff;
$widget-default-width: 0%; //200px;
$widget-default-height: 250px;
// small
$widget-small-width: 25%;
$widget-small-height: 0px;
// medium
$widget-medium-width: 25%; //100px;
$widget-medium-height: 0px;
// large
$widget-large-width: 50%; //200px;
$widget-large-height: 0px;
.widgets {
	display: flex;
	flex-flow: row wrap;
}
.widget {
	@mixin widget-seed {
		padding: 16px;
		background-color: $widget-background-color;
	}
	&_title {
		font-weight: 700;
	}
	&-s {
		@include widget-seed;
		width: $widget-default-width + $widget-small-width;
		height: $widget-default-height + $widget-small-height;
	}
	&-m {
		@include widget-seed;
		width: $widget-default-width + $widget-medium-width;
		height: $widget-default-height + $widget-medium-height;
	}
	&-l {
		@include widget-seed;
		width: $widget-default-width + $widget-large-width;
		height: $widget-default-height + $widget-large-height;
	}
}
</style>
