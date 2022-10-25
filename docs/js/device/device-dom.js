/**
 * DOM for a device object
 */
class DeviceDOM {
	parent;
	asset;
	tag;
	remove;

	constructor (id) {
		let item = DOM(null, "div", {classList: "flex-box horizontal pad gap device center"});
		let name = DOM(item, "input", {classList: "device-asset",
			dataset: {action: AppAction.DEVICE_ASSET, id: id}});

		let tag = DOM(item, "input", {classList: "device-tag"});

		let remove = DOM(item, "button", {innerHTML: "close", classList: "material-symbols-outlined icon", title: "Remove Device",
			dataset: {action: AppAction.DEVICE_REMOVE, id: id}});

		this.parent = item;
		this.asset = name;
		this.tag = tag;
		this.remove = remove;
	}
}