class AppAction {
	static DEVICE_ASSET = "device-asset";
	static DEVICE_MODEL = "device-model";
	static DEVICE_TYPE = "device-type";
	static DEVICE_REMOVE = "device-remove";
	static DEVICE_NEW = "device-new";

	static LOCATION_NAME = "location-name";
	static LOCATION_REMOVE = "location-remove";
	static LOCATION_NEW = "location-new";
	static LOCATION_VIEW = "location-view";

	static APP_EXPORT = "app-export";
	static APP_CLEAR = "app-clear";
}

const LOCALSTORAGE_KEY = "inventory";

class App {
	locations = new ArrayMap();
	active_location_id = -1;
	current_location_id = 0;

	init() {
		let parse = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY)) || [];

		for (let location of parse) {
			this.addLocation(location[0]);

			for (let device of location[1]) {
				this.activeLocation().addDevice(... device);
			}
		}
		
		var DATE = new Date();
		document.getElementById("sheet-name").value = `inventory-${DATE.getMonth() + 1}-${DATE.getDate()}-${DATE.getFullYear()}`;
		document.title = document.getElementById("sheet-name").value;

		window.addEventListener("click", (event) => { this.handleClick(event); });
		window.addEventListener("keyup", (event) => { this.handleKeyUp(event); });

		this.loadLocations();
		this.loadDevices();
	}

	loadLocations() {
		document.getElementById("location-list").innerHTML = "";

		for (let l = 0; l < this.locations.length(); l ++) {
			document.getElementById("location-list").appendChild(this.locations.at(l).dom.parent);

			toggleClass(this.locations.at(l).dom.parent, this.locations.at(l).id === this.active_location_id, "selected");
		}
	}

	loadDevices() {
		document.getElementById("device-list").innerHTML = "";
		document.getElementById("location-header").innerHTML = "";

		if (this.active_location_id !== -1) {
			for (let d = this.activeLocation().devices.length() - 1; d >= 0; d --) {
				document.getElementById("device-list").appendChild(this.activeLocation().devices.at(d).dom.parent);
			}

			document.getElementById("location-header").innerHTML = this.activeLocation().name;
		}
	}

	addLocation(name) {
		this.locations.push(new Location(name, this.current_location_id));

		this.active_location_id = this.current_location_id;
		
		document.getElementById("location-list").appendChild(this.activeLocation().dom.parent);
		this.loadDevices();

		this.current_location_id += 1;
	}

	updateDom() {
		for (let l = 0; l < this.locations.length(); l ++) {
			let loc = this.locations.at(l);

			toggleClass(loc.dom.parent, loc.id === this.active_location_id, "selected");
		}
	}

	activeLocation() { return this.locations.get(this.active_location_id); }
}

App.prototype.clear = function () {
	if (window.confirm("Are you sure you want to delete all locations and all devices?")) {
		this.active_location_id = -1;
		this.current_location_id = 0;
		this.locations = new ArrayMap();

		window.localStorage.removeItem(LOCALSTORAGE_KEY);

		this.loadLocations();
		this.loadDevices();
	}
};

App.prototype.save = function () {
	let output = [];

	for (let l = 0; l < this.locations.length(); l ++) {
		let loc = this.locations.at(l);
		let res = [];

		for (let d = 0; d < loc.devices.length(); d ++) {
			let device = loc.devices.at(d);

			res.push([device.asset, device.model, device.type]);
		}

		output.push([loc.name, res]);
	}

	window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(output));
};