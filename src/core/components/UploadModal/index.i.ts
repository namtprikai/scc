export interface UpdateFlowItem {
	src: string;
	flow: Set<'save' | 'test' | 'prod'>;
	discription: string;
	active: boolean;
	disable?: boolean;
	hidden?: boolean;
}
