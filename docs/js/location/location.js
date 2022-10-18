class Location extends ArrayMapItem {
	name;
	devices;
	selected = false;
	dom = new LocationDOM();

	new_id = 0;

	constructor (name, id) {
		super(id);
		
		this.name = name;
		this.devices = new ArrayMap();

		this.initDom();
	}

	initDom() {
		this.dom.init(this.id);

		this.updateDom();
	}

	updateDom() {
		this.dom.name.innerHTML = this.name;
		this.dom.rename.value = this.name;
		this.dom.count.innerHTML = this.devices.length();
	}

	addDevice(asset, model, type) {
		this.devices.push(new Device(asset, model, type, this.new_id));

		this.new_id += 1;
		this.updateDom();
	}

	export() {
		let data = [];

		for (let d = 0; d < this.devices.length(); d ++) {
			data.push([this.name, ... this.devices.at(d).export()]);
		}

		return data;
	}
}