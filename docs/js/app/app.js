/**
 * Enum of app actions
 */
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


/**
 * Container to hold data and dom information
 */
class App {
	locations = new ArrayMap();
	active_location_id = -1;
	current_location_id = 0;

	static LOCALSTORAGE_KEY = "inventory";

	updateLocationDom() {
		document.getElementById("location-list").innerHTML = "";

		for (let l = 0; l < this.locations.length(); l ++) {
			document.getElementById("location-list").appendChild(this.locations.at(l).dom.parent);

			toggleClass(this.locations.at(l).dom.parent, this.locations.at(l).key === this.active_location_id, "selected");
		}
	}

	updateDeviceDom() {
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
		this.updateDeviceDom();

		this.current_location_id += 1;
	}

	updateDom() {
		for (let l = 0; l < this.locations.length(); l ++) {
			let loc = this.locations.at(l);

			toggleClass(loc.dom.parent, loc.key === this.active_location_id, "selected");
		}
	}

	activeLocation() { return this.locations.get(this.active_location_id); }
}


/**
 * Initialize the app, app data, and app dom
 */
App.prototype.init = function () {
	// load data from localstorage
	let parse = JSON.parse(window.localStorage.getItem(App.LOCALSTORAGE_KEY)) || [];

	for (let location of parse) {
		this.addLocation(location[0]);

		for (let device of location[1]) {
			this.activeLocation().addDevice(... device);
		}
	}
	
	// set the sheet name
	var DATE = new Date();
	document.getElementById("sheet-name").value = `inventory-${DATE.getMonth() + 1}-${DATE.getDate()}-${DATE.getFullYear()}`;
	document.title = document.getElementById("sheet-name").value;

	// load events
	window.addEventListener("click", (event) => { this.handleClick(event); });
	window.addEventListener("keyup", (event) => { this.handleKeyUp(event); });

	// update dom
	this.updateLocationDom();
	this.updateDeviceDom();
};



/**
 * Format and the export the data to a TSV file
 */
 App.prototype.dataExport = function () {
	let output = new class Output {
		headers = ["Location", "Asset", "Year", "Model", "Type"];
		formulas = [];
		data = [];
	};

	for (let l = 0; l < this.locations.length(); l ++) {
		output.data.push(... this.locations.at(l).export());
	}

	// find all unique device identifiers
	let unique = [];

	for (let r = 0; r < output.data.length; r ++) {
		let isUnique = true;

		for (let u = 0; u < unique.length; u ++) {
			if (output.data[r][2] === unique[u][0] && output.data[r][3] === unique[u][1] && output.data[r][4] === unique[u][2]) {
				isUnique = false;
				break;
			}
		}

		if (isUnique) {
			unique.push([output.data[r][2], output.data[r][3], output.data[r][4]]);
		}
	}

	// sort all identifiers
	for (let i = 0; i < unique.length; i ++) {
		for (let j = i + 1; j < unique.length; j ++) {
			let [E, C, A, F, D, B] = [... unique[i], ... unique[j]];

			if ((A < B) || (A === B) && ((C > D) || (C === D) && (E > F))) {
				let temp = [... unique[i]];
				unique[i] = [... unique[j]];
				unique[j] = temp;
			}
		}
	}

	// add new rows to data
	for (let u = 0; u < unique.length; u ++) {
		output.headers.push(unique[u].join(" "));

		for (let r = 0; r < output.data.length; r ++) {
			output.data[r].push("");
		}
	}

	// add device asset to identifier row
	for (let r = 0; r < output.data.length; r ++) {
		for (let u = 0; u < unique.length; u ++) {
			if (output.data[r][2] === unique[u][0] && output.data[r][3] === unique[u][1] && output.data[r][4] === unique[u][2]) {
				output.data[r][5 + u] = output.data[r][1];
			}
		}
	}

	let column_char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const ROW_COUNT = 1000;

	for (let d = 0; d < output.headers.length; d ++) {
		if (d > 4 || d === 1) {
			output.formulas[d] = `=COUNTA(${column_char[d]}3:${column_char[d]}${ROW_COUNT})`;
		} else if (d === 0) {
			output.formulas[d] = `=COUNTA(UNIQUE(${column_char[d]}3:${column_char[d]}${ROW_COUNT}))`;
		}
	}

	// format
	let res = [];

	res.push(output.headers.join("\t"));
	res.push(output.formulas.join("\t"));

	for (let r = 0; r < output.data.length; r ++) {
		res.push(output.data[r].join("\t"));
	}

	// download
	let a = window.document.createElement("a");
	a.href = window.URL.createObjectURL(new Blob([res.join("\n")], {type: 'text/tsv'}));
	a.download = `${document.getElementById("sheet-name").value}.tsv`;

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};



/**
 * Remove all data and update the DOM
 */
App.prototype.dataClear = function () {
	if (window.confirm("Are you sure you want to delete all locations and all devices?")) {
		this.active_location_id = -1;
		this.current_location_id = 0;
		this.locations = new ArrayMap();

		window.localStorage.removeItem(App.LOCALSTORAGE_KEY);

		this.updateLocationDom();
		this.updateDeviceDom();
	}
};



/**
 * Save the data to localstorage
 */
App.prototype.dataSave = function () {
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

	window.localStorage.setItem(App.LOCALSTORAGE_KEY, JSON.stringify(output));
};