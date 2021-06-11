<template>
	<div class>
		<UserWinDemo />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { mapGetters } from 'vuex';
import DashboardParent from '@/views/dashboard/index';
import PanThumb from '@/components/PanThumb/index.vue';
import { PRODUCT_ID } from './../../utils/configration';
import { Ajax } from '@/utils/parts';
import { eventHub } from '@/init/eventHub';
import { AdminUserModule } from '@/store/modules/adminUser';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import { TagService } from '../../services/tag';
import VueTagsInput from '@johmun/vue-tags-input';
import WrapMessage from '@/components/WrapMessage/index.vue';
import UserWinDemo from '@/views/UserWinDemo/index.vue';
// @ts-ignore
@Component({
	components: { UserWinDemo },
	filters: {
		json: (o: any) => JSON.stringify(o),
	},
})
export default class UserWin extends Vue {

}
</script>

<style lang="scss" scoped>

</style>
