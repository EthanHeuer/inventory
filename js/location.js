class Location {
	dom = new class Dom {
		parent;
		name;
		rename;
		count;
	};

	current_device_id = 0;

	constructor (name, id) {
		this.name = name;
		this.devices = [];
		this.id = id;
		this.selected = false;

		this.initDom();
	}

	initDom() {
		let item = DOM(null, "div", {classList: "flex-box horizontal gap location", dataset: {action: AppAction.TOGGLE_LOCATION, location: this.id}});

		let cell1 = DOM(item, "div", {classList: "flex flex-box horizontal"});
		let name = DOM(cell1, "div", {innerHTML: this.name, classList: "flex location-name", dataset: {action: AppAction.TOGGLE_LOCATION, location: this.id}});

		let rename_cont = DOM(cell1, "div", {classList: "flex flex-box horizontal icon-input location-input-holder"});
		let rename_icon = DOM(rename_cont, "span", {innerHTML: "edit", classList: "material-symbols-outlined"});
		let rename = DOM(rename_cont, "input", {value: this.name, classList: "flex location-input", dataset: {action: AppAction.LOCATION_NAME, location: this.id}});

		let count = DOM(item, "div", {innerHTML: this.devices.length, classList: "location-count", dataset: {action: AppAction.TOGGLE_LOCATION, location: this.id}});
		
		let remove = DOM(item, "button", {innerHTML: "close", classList: "material-symbols-outlined icon", dataset: {action: AppAction.LOCATION_REMOVE, location: this.id}, title: "Remove Location"});

		this.dom.parent = item;
		this.dom.name = name;
		this.dom.rename = rename;
		this.dom.count = count;

		this.updateDom();
	}

	updateDom() {
		this.dom.name.innerHTML = this.name;
		this.dom.rename.value = this.name;
		this.dom.count.innerHTML = this.devices.length;
	}

	addDevice(asset, model, type) {
		this.devices.push(new Device(asset, model, type, this.current_device_id));

		this.current_device_id += 1;
		this.updateDom();
	}

	getDevice(id) {
		for (let d = 0; d < this.devices.length; d ++) {
			if (this.devices[d].id === id) {
				return this.devices[d];
			}
		}
	}

	export() {
		let data = [];

		for (let d = 0; d < this.devices.length; d ++) {
			data.push([this.name, ... this.devices[d].export()]);
		}

		return data;
	}
}