export {};

declare global {
	interface Window {
		showSaveFilePicker: any;
	}

	type HSL = {
		hue: number;
		sat?: number;
		lit?: number;
		alp?: number;
	};
}
