/**
 * Enum for a device model
 */
class DeviceModel {
	static HP = "HP";
	static MAC = "Mac";
}

/**
 * Enum for a device type
 */
class DeviceType {
	static STUDENT = "Student";
	static LOANER = "Loaner";
	static FACULTY = "Faculty";
}

class Device extends ArrayMapItem {
	asset;
	model;
	type;
	time;
	dom = new DeviceDOM();

	constructor (asset, model, type, id) {
		super(id);

		this.asset = asset;
		this.model = model;
		this.type = type;
		this.time = Date.now();

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