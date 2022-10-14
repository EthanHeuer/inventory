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
	dom = new DeviceDOM();

	constructor (asset, model, type, id) {
		this.asset = asset;
		this.model = model;
		this.type = type;
		this.id = id;

		this.initDom();
	}

	initDom() {
		this.dom.init(this.id);
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
		let year = (this.asset.length === 9 ? this.asset.split("").splice(0,4).join("") : "");

		return [this.asset, year, this.model, this.type];
	}
}