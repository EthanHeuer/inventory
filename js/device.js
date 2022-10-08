class DeviceModel {
	static HP = "HP";
	static MAC = "Mac";
}

class DeviceType {
	static STUDENT = "Student";
	static LOANER = "Loaner";
	static FACULTY = "Faculty";
}

class Device {
	dom = new class Dom {
		parent;
		asset;
		model;
		type;
	};

	constructor (asset, model, type, id) {
		this.asset = asset;
		this.model = model;
		this.type = type;
		this.id = id;

		this.initDom();
	}

	initDom() {
		let item = DOM(null, "div", {classList: "flex-box horizontal pad device"});

		let name = document.createElement("input");
		name.classList.add("device-asset");
		name.dataset.action = AppAction.DEVICE_ASSET;
		name.dataset.device = this.id;
		item.appendChild(name);

		let model = document.createElement("select");
		model.classList.add("device-model");
		model.dataset.action = AppAction.DEVICE_MODEL;
		model.dataset.device = this.id;
		item.appendChild(model);

		for (let opt of [DeviceModel.HP, DeviceModel.MAC]) {
			let option = document.createElement("option");
			model.appendChild(option);
			option.innerHTML = opt;
			option.value = opt;
		}

		let type = document.createElement("select");
		type.classList.add("device-model");
		type.dataset.action = AppAction.DEVICE_TYPE;
		type.dataset.device = this.id;
		item.appendChild(type);

		for (let opt of [DeviceType.STUDENT, DeviceType.LOANER, DeviceType.FACULTY]) {
			let option = document.createElement("option");
			type.appendChild(option);
			option.innerHTML = opt;
			option.value = opt;
		}

		let remove = document.createElement("button");
		remove.innerHTML = `close`;
		remove.classList.add("material-symbols-outlined", "icon");
		remove.dataset.action = AppAction.DEVICE_REMOVE;
		remove.dataset.device = this.id;
		remove.title = "Remove device";
		item.appendChild(remove);

		this.dom.parent = item;
		this.dom.asset = name;
		this.dom.model = model;
		this.dom.type = type;

		this.updateDom();
	}

	updateDom() {
		this.dom.asset.value = this.asset;

		for (let option of this.dom.model.getElementsByTagName("option")) {
			option.selected = (option.value === this.model);
		}

		for (let option of this.dom.type.getElementsByTagName("option")) {
			option.selected = (option.value === this.type);
		}
	}

	export() {
		let year = "";

		if (this.asset.length === 9) {
			year = this.asset.split("").splice(0,4).join("");
		}

		return [this.asset, year, this.model, this.type];
	}
}