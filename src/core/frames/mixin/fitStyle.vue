<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import { AppModule, DeviceType } from '@/store/modules/app';
import { eventHub } from '@/init/eventHub';

export type FitStyleObject = {
	height?: number | string;
	width?: number | string;
	transition?: string;
};

// TODO: Design a global constant management method that can share values
// between script and style.
const SidebarWidth = {
	Open: 180,
	Close: 38,
};

/**
 * フレーム外部の要素 (サイドバーやヘッダー) などのサイズが変更された時に、
 * フレームサイズを目一杯まで広げるためのスタイルを生成する関数 `fitStyle`
 * を提供する Mixin コンポーネント
 *
 * フレーム外部の要素のサイズ変更は `fitStyle` イベントで取得できる
 */
// @ts-ignore
@Component
export default class FitStyle extends Vue {
	private get sidebar() {
		return AppModule.sidebar;
	}

	private get device() {
		return AppModule.device;
	}

	@Watch('sidebar', { deep: true })
	private onToggle() {
		eventHub.$emit('fitStyle', this.fitStyle());
	}

	fitStyle() {
		if (this.device == DeviceType.Mobile) {
			return { height: '100%', width: '100%' };
		}

		const element = this.$el as HTMLElement;
		if (!this.sidebar.withoutAnimation) {
			return {
				// アニメーションがある場合は、要素のオフセット値をすぐ取得してもアニメーション開始時の値しか取れないため、
				// `width` の固定値を数秒後にセットする (とても微妙な処理)
				// height: `calc(100% - ${element.offsetTop}px)`,
				height: 'calc(100% - 50px)',
				width: `calc(100% - ${this.sidebar.opened ? SidebarWidth.Open : SidebarWidth.Close}px)`,
				transition: 'width 0.28s',
			};
		}

		return {
			// height: `calc(100% - ${element.offsetTop}px)`,
			height: 'calc(100% - 50px)',
			width: `calc(100% - ${element.offsetLeft}px)`,
		};
	}
}
</script>
