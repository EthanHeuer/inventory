class AppAction {
	static TOGGLE_LOCATION = "location";

	static DEVICE_ASSET = "device-asset";
	static DEVICE_MODEL = "device-model";
	static DEVICE_TYPE = "device-type";
	static DEVICE_REMOVE = "device-remove";
	static DEVICE_NEW = "device-new";

	static LOCATION_NAME = "location-name";
	static LOCATION_REMOVE = "location-remove";
	static LOCATION_NEW = "location-new";

	static APP_EXPORT = "app-export";
	static APP_CLEAR = "app-clear";
}

const LOCALSTORAGE_KEY = "inventory";

class App {
	locations = [];
	active_location_id = -1;
	current_location_id = 0;

	init() {
		window.addEventListener("click", (event) => { this.handleClick(event); });
		window.addEventListener("keyup", (event) => { this.handleKeyUp(event); });

		let parse = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY)) || [];

		for (let location of parse) {
			this.addLocation(location[0]);

			for (let device of location[1]) {
				this.activeLocation().addDevice(... device);
			}
		}

		this.loadLocations();
		this.loadDevices();
	}

	loadLocations() {
		document.getElementById("location-list").innerHTML = "";

		for (let l = 0; l < this.locations.length; l ++) {
			document.getElementById("location-list").appendChild(this.locations[l].dom.parent);

			if (this.locations[l].id === this.active_location_id) {
				this.locations[l].dom.parent.classList.add("selected");
			} else {
				this.locations[l].dom.parent.classList.remove("selected");
			}
		}
	}

	loadDevices() {
		document.getElementById("device-list").innerHTML = "";

		if (this.active_location_id !== -1) {
			for (let d = 0; d < this.activeLocation().devices.length; d ++) {
				document.getElementById("device-list").appendChild(this.activeLocation().devices[d].dom.parent);
			}
		}
	}

	addLocation(name) {
		this.locations.push(new Location(name, this.current_location_id));

		this.active_location_id = this.current_location_id;
		
		document.getElementById("location-list").appendChild(this.activeLocation().dom.parent);
		this.loadDevices();

		this.current_location_id += 1;
	}

	getLocation(id) {
		for (let l = 0; l < this.locations.length; l ++) {
			if (this.locations[l].id === id) {
				return this.locations[l];
			}
		}
	}

	export() {
		let data = [
			["Location", "Asset", "Year", "Model", "Type"]
		];

		for (let l = 0; l < this.locations.length; l ++) {
			data.push(... this.locations[l].export());
		}

		let unique = [];

		for (let r = 1; r < data.length; r ++) {
			let isUnique = true;

			for (let u = 0; u < unique.length; u ++) {
				if (
					data[r][2] === unique[u][0] &&
					data[r][3] === unique[u][1] &&
					data[r][4] === unique[u][2]
				) {
					isUnique = false; break;
				}
			}

			if (isUnique) {
				unique.push([data[r][2], data[r][3], data[r][4]]);
			}
		}

		for (let i = 0; i < unique.length; i ++) {
			for (let j = i + 1; j < unique.length; j ++) {
				let [E, C, A, F, D, B] = [... unique[i], ... unique[j]];

				let G = A < B;
				let H = A === B;
				let I = C > D;
				let J = C === D;
				let K = E > F;

				if (G || H && I || H && J && K) {
					let temp = [... unique[i]];
					unique[i] = [... unique[j]];
					unique[j] = temp;
				}
			}
		}

		for (let u = 0; u < unique.length; u ++) {
			data[0].push(unique[u].join(" "));

			for (let r = 1; r < data.length; r ++) {
				data[r].push("");
			}
		}

		for (let r = 1; r < data.length; r ++) {
			for (let u = 0; u < unique.length; u ++) {
				if (
					data[r][2] === unique[u][0] &&
					data[r][3] === unique[u][1] &&
					data[r][4] === unique[u][2]
				) {
					data[r][5 + u] = data[r][1];
				}
			}
		}

		let res = [];

		for (let r = 0; r < data.length; r ++) {
			res.push(data[r].join("\t"));
		}

		let a = window.document.createElement("a");
		a.href = window.URL.createObjectURL(new Blob([res.join("\n")], {type: 'text/tsv'}));
		a.download = `${document.getElementById("sheet-name").value}.tsv`;

		document.body.appendChild(a);
		//a.click();
		document.body.removeChild(a);
	}

	updateDom() {
		for (let loc of this.locations) {
			if (loc.id === this.active_location_id) {
				loc.dom.parent.classList.add("selected");
			} else {
				loc.dom.parent.classList.remove("selected");
			}
		}
	}

	clear() {
		if (window.confirm("Are you sure you want to delete all locations and all devices?")) {
			this.active_location_id = -1;
			this.current_location_id = 0;
			this.locations = [];

			window.localStorage.removeItem(LOCALSTORAGE_KEY);

			this.loadLocations();
			this.loadDevices();
		}
	}

	activeLocation() {
		for (let l = 0; l < this.locations.length; l ++) {
			if (this.locations[l].id === this.active_location_id) {
				return this.locations[l];
			}
		}
	}

	save() {
		let output = [];

		for (let loc of this.locations) {
			let res = [];

			for (let device of loc.devices) {
				res.push([device.asset, device.model, device.type]);
			}

			output.push([loc.name, res]);
		}

		window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(output));
	}
}