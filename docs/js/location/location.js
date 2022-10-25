/**
 * Object to store a location and its data
 */
class LocationPlace extends ArrayMapItem {
	name;
	devices;
	dom;
	selected = false;
	next_device_id = 0;

	/**
	 * @param {String} name location name
	 * @param {Number} id key and id for the array map
	 */
	constructor (name, id) {
		super(id);
		
		this.name = name;
		this.devices = new ArrayMap();
		this.dom = new LocationDOM(id);

		this.updateDom();
	}

	updateDom() {
		this.dom.name.innerHTML = this.name;
		this.dom.rename.value = this.name;
		this.dom.count.innerHTML = this.devices.length();
	}

	addDevice(asset, model, type) {
		this.devices.push(new Device(asset, model, type, this.next_device_id));

		this.next_device_id += 1;
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