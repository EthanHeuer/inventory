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
	next_location_id = 0;

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

		if (this.active_location_id !== -1) {
			for (let d = this.activeLocation().devices.length() - 1; d >= 0; d --) {
				document.getElementById("device-list").appendChild(this.activeLocation().devices.at(d).dom.parent);
			}
		}
	}

	addLocation(name) {
		this.locations.push(new LocationPlace(name, this.next_location_id));

		this.active_location_id = this.next_location_id;
		
		document.getElementById("location-list").appendChild(this.activeLocation().dom.parent);
		this.updateDeviceDom();

		this.next_location_id += 1;
	}

	updateDom() {
		for (let l = 0; l < this.locations.length(); l ++) {
			let loc = this.locations.at(l);

			toggleClass(loc.dom.parent, loc.key === this.active_location_id, "selected");
		}
	}

	/**
	 * @return {LocationPlace}
	 */
	activeLocation() { return this.locations.get(this.active_location_id); }
}



/**
 * Initialize the app, app data, and app dom
 */
App.prototype.init = function () {
	// load data from localstorage
	let parse = JSON.parse(window.localStorage.getItem(App.LOCALSTORAGE_KEY)) || [];

	/*

	let tempVal = (value, prob, result) => {
		let sum = 0;

		for (let r = 0; r < prob.length; r ++) {
			let old_sum = sum;
			sum += prob[r];

			if (value >= old_sum && value < sum) {
				return result[r];
			}
		}
	};

	// generate random data

	parse = [];

	for (let l = 0; l < 20; l ++) {
		parse.push([`Location ${l + 1}`, []]);

		for (let d = 0; d < 50; d ++) {
			let asset = "";

			let year = tempVal(Math.random(),
				[0.2, 0.35, 0.3, 0.1, 0.05],
				["2022", "2021", "2020", "2019", "2018"]
			);

			let purpose = tempVal(Math.random(),
				[0.1, 0.05, 0.5, 0.35],
				["550", "554", "11", "20"]
			);

			let id = ("" + (1000 + Math.floor(Math.random() * 1000))).split("").splice(1 + purpose.length - 2, 4).join("");

			asset = year + purpose + id;

			parse[l][1].push([asset]);
		}
	}t
	*/


	for (let location of parse) {
		this.addLocation(location[0]);

		for (let device of location[1]) {
			this.activeLocation().addDevice(device);
		}
	}

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
	
	// set the sheet name
	let DATE = new Date();
	let sheet_name = `inventory-${DATE.getMonth() + 1}-${DATE.getDate()}-${DATE.getFullYear()}`;

	let a = window.document.createElement("a");
	a.href = window.URL.createObjectURL(new Blob([res.join("\n")], {type: 'text/tsv'}));
	a.download = `${sheet_name}.tsv`;

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
		this.next_location_id = 0;
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

			res.push([device.asset]);
		}

		output.push([loc.name, res]);
	}

	window.localStorage.setItem(App.LOCALSTORAGE_KEY, JSON.stringify(output));
};