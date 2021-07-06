<template>
	<div
		v-if="!item.meta || (!item.meta.hidden && roleCheck(item.meta.roles))"
		:class="[
			'menu-wrapper',
			(item.meta || { isBottom: false }).isBottom ? 'menu_item__bottom' : '',
			collapse ? 'simple-mode' : 'full-mode',
			{ 'first-level': !isNest },
		]"
	>
		<template
			v-if="
				hasOneShowingChild(item.children, item) &&
				(!onlyOneChild.children || onlyOneChild.meta.noShowingChildren)
			"
		>
			<app-link
				:to="resolvePath(flat.path)"
				v-for="flat in flatChild"
				:key="flat.path"
			>
				<el-menu-item
					:index="resolvePath(flat.path)"
					:class="{ 'submenu-title-noDropdown': !isNest }"
				>
					<b-avatar
						v-if="item.meta && item.meta.icon && item.meta.icon === 'avatar'"
						variant="info"
						:src="UserThumbnailUrl"
						class="mr-1"
					>
						<div
							class="SidebarItem__avatar"
							:style="{ 'background-image': 'url(' + UserThumbnailUrl + ')' }"
						></div>
					</b-avatar>
					<svg-icon
						v-else-if="flat.meta && flat.meta.icon"
						:name="flat.meta.icon"
						class="active"
					/>
					<svg-icon
						v-else-if="item.meta && item.meta.icon"
						:name="item.meta.icon"
						class="active"
					/>
					<span v-if="flat.meta && flat.meta.title" slot="title">{{
						flat.meta.title
					}}</span>
					<span v-else-if="item.meta && item.meta.title" slot="title">{{
						item.meta.title
					}}</span>
				</el-menu-item>
			</app-link>
		</template>
		<el-submenu v-else :index="resolvePath(item.path)">
			<template slot="title">
				<b-avatar
					v-if="item.meta && item.meta.icon && item.meta.icon == 'avatar'"
					variant="info"
					src="https://placekitten.com/300/300"
					class="mr-3"
				></b-avatar>
				<svg-icon v-else-if="item.meta && item.meta.icon" :name="item.meta.icon" />
				<span v-if="item.meta && item.meta.title" slot="title">{{
					item.meta.title
				}}</span>
			</template>
			<sidebar-item
				v-for="child in item.children"
				:is-nest="true"
				:item="child"
				:key="child.path"
				:base-path="resolvePath(child.path)"
				:collapse="collapse"
				class="nest-menu"
			/>
		</el-submenu>
	</div>
</template>

<script lang="ts">
import path from "path";
import { Route } from "vue-router";
import { isExternal } from "@/utils/validate";
import { Component, Vue, Prop } from "vue-property-decorator";
import AppLink from "./Link.vue";
import { s3, CLIENT_ID } from "../../../../utils/configration";
import { UserModule } from "@/store/modules/user";
// @ts-ignore
@Component({
	// Set 'name' here to prevent uglifyjs from causing recursive component not work
	// See https://medium.com/haiiro-io/element-component-name-with-vue-class-component-f3b435656561 for detail
	name: "SidebarItem",
	components: {
		AppLink,
	},
})
export default class SidebarItem extends Vue {
	@Prop({ required: true }) private item!: Route;
	@Prop({ default: false }) private isNest!: boolean;
	@Prop({ default: false }) private collapse!: boolean;
	@Prop({ default: "" }) private basePath!: string;
	private onlyOneChild: Route | null = null;
	private flatChild: Route[] = [];
	private roleCheck(roles: number[]) {
		if (!roles) {
			return true;
		}
		for (const role of roles) {
			if (UserModule.Role.has(role)) {
				return true;
			}
		}
		return false;
	}

	private get UserId(): number {
		return UserModule.id;
	}

	private get UserThumbnailUrl(): string {
		return `${s3}/${CLIENT_ID}/${this.UserThumbFileName}`;
	}

	private get UserThumbFileName(): string {
		return `${this.UserId}_thumb.gif`;
	}

	private hasOneShowingChild(children: Route[], parent: Route) {
		let showingChildren: Route[] = [];

		if (children) {
			showingChildren = children.filter((item: Route) => {
				if (item.meta && item.meta.hidden) {
					return false;
				} else {
					this.onlyOneChild = item;
					return true;
				}
			});
		}

		if (showingChildren.length >= 1) {
			// このflatは戻す必要ありかも
			this.flatChild = showingChildren;
			return true;
		} else if (showingChildren.length === 0) {
			this.onlyOneChild = {
				...parent,
				path: "",
				meta: { noShowingChildren: true },
			};
			return true;
		}

		this.onlyOneChild = null;
		return false;
	}

	private resolvePath(routePath: string) {
		if (isExternal(routePath)) {
			return routePath;
		}
		return path.resolve(this.basePath, routePath);
	}
}
</script>

<style lang="scss">
@import "src/core/styles/variables.scss";
.SidebarItem__avatar {
	background-position: center center;
	background-size: cover;
	background-repeat: no-repeat;
	background-color: $White;
	width: 100%;
	height: 100%;
}
.menu_item__bottom {
	position: sticky;
	bottom: 0px;
	margin: auto;
	right: 0px;
	left: 0px;
}
.el-submenu.is-active > .el-submenu__title {
	color: $subMenuActiveText;
}

// .full-mode {
// 	.nest-menu .el-submenu > .el-submenu__title,
// 	.el-submenu .el-menu-item {
// 		background-color: $subMenuBg;

// 		&:hover {
// 			background-color: $subMenuHover;
// 		}
// 	}
// }

.simple-mode {
	&.first-level {
		.submenu-title-noDropdown {
			padding-left: 10px !important;
			position: relative !important;

			.el-tooltip {
				padding: 0 10px !important;
			}
		}

		.el-submenu {
			overflow: hidden;

			& > .el-submenu__title {
				padding-left: 10px !important;

				.el-submenu__icon-arrow {
					display: none !important;
				}
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.svg-icon {
	margin-right: 16px;
}
</style>
