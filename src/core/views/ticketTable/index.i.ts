export interface KeyData {
	[key: string]: { name: string; value: string | Array<string>; data: any };
}
export interface ArrayKeyData {
	[key: string]: { name: string; value: Array<string> };
}
export interface StringKeyData {
	[key: string]: { name: string; value: string };
}
export interface TicketData {
	[key: string]: any; // Array<string|any> | string|number| undefined;
}
export interface EnquateTicket {
	[id: string]:
		| {
				type: "radio";
				label: string;
				value: { value: string; label: string } | null;
		  }
		| {
				type: "checkbox";
				label: string;
				value: Array<{ value: string; label: string }>;
		  }
		| {
				type: "textarea";
				label: string;
				value: string;
		  };
}

