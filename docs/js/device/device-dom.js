/**
 * DOM for a device object
 */
class DeviceDOM {
	parent;
	tag;
	remove;

	constructor (id) {
		let item = DOM(null, "div", {classList: "flex-box horizontal pad gap center device"});

		let tag = DOM(item, "span", {classList: "flex-box horizontal gap device-tag"});

		let remove = DOM(item, "button", {innerHTML: "close", classList: "material-symbols-outlined icon", title: "Remove Device",
			dataset: {action: AppAction.DEVICE_REMOVE, id: id}});

		this.parent = item;
		this.tag = tag;
		this.remove = remove;
	}
}