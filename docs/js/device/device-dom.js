/**
 * DOM for a device object
 */
class DeviceDOM {
	parent;
	asset;
	model;
	type;
	remove;

	constructor (id) {
		let item = DOM(null, "div", {classList: "flex-box horizontal pad device center"});
		let name = DOM(item, "input", {classList: "device-asset",
			dataset: {action: AppAction.DEVICE_ASSET, id: id}});

		let model = DOM(item, "select", {classList: "device-model",
			dataset: {action: AppAction.DEVICE_MODEL, id: id}});

		for (let opt of [DeviceModel.HP, DeviceModel.MAC]) { DOM(model, "option", {innerHTML: opt, value: opt}); }

		let type = DOM(item, "select", {classList: "device-type",
			dataset: {action: AppAction.DEVICE_TYPE, id: id}});

		for (let opt of [DeviceType.STUDENT, DeviceType.LOANER, DeviceType.FACULTY]) { DOM(type, "option", {innerHTML: opt, value: opt}); }

		let remove = DOM(item, "button", {innerHTML: "close", classList: "material-symbols-outlined icon", title: "Remove Device",
			dataset: {action: AppAction.DEVICE_REMOVE, id: id}});

		this.parent = item;
		this.asset = name;
		this.model = model;
		this.type = type;
		this.remove = remove;
	}
}