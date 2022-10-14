class DeviceDOM {
	parent;
	asset;
	model;
	type;
	remove;

	init(id) {
		let item = DOM(null, "div", {classList: "flex-box horizontal pad device"});
		let name = DOM(item, "input", {classList: "device-asset", dataset: {action: AppAction.DEVICE_ASSET}});

		let model = DOM(item, "select", {classList: "device-model", dataset: {action: AppAction.DEVICE_MODEL}});
		for (let opt of [DeviceModel.HP, DeviceModel.MAC]) { DOM(model, "option", {innerHTML: opt, value: opt}); }

		let type = DOM(item, "select", {classList: "device-type", dataset: {action: AppAction.DEVICE_TYPE}});
		for (let opt of [DeviceType.STUDENT, DeviceType.LOANER, DeviceType.FACULTY]) { DOM(type, "option", {innerHTML: opt, value: opt}); }

		let remove = DOM(item, "button", {innerHTML: "close", classList: "material-symbols-outlined icon", dataset: {action: AppAction.DEVICE_REMOVE}, title: "Remove Device"});

		this.parent = item;
		this.asset = name;
		this.model = model;
		this.type = type;
		this.remove = remove;

		this.asset.dataset.id = id;
		this.model.dataset.id = id;
		this.type.dataset.id = id;
		this.remove.dataset.id = id;
	}
}