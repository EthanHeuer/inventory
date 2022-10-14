App.prototype.handleClick = function (event) {
	let action = event.target.dataset.action;
	let id = Number(event.target.dataset.id);

	if (action) {
		switch (action) {

		// select a location to view
		case AppAction.LOCATION_VIEW:
			this.active_location_id = id;

			this.updateDom();
			this.loadDevices();

		// change devices type
		break; case AppAction.DEVICE_TYPE:
			this.activeLocation().getDevice(id).type = event.target.value;

		// change devices model
		break; case AppAction.DEVICE_MODEL:
			this.activeLocation().getDevice(id).model = event.target.value;
		
		// remove device from active location
		break; case AppAction.DEVICE_REMOVE:
			for (let i = 0; i < this.activeLocation().devices.length; i ++) {
				if (this.activeLocation().devices[i].id === id) {
					this.activeLocation().devices.splice(i, 1);
					break;
				}
			}

			this.loadDevices();
			this.activeLocation().updateDom();
		
		// remove location
		break; case AppAction.LOCATION_REMOVE:
			let i;
			for (i = 0; i < this.locations.length; i ++) {
				if (this.locations[i].id === id) { break; }
			}

			if (window.confirm(`Are you sure you want to delete ${this.locations[i].name} and all of its devices?`)) {
				this.locations.splice(i, 1);

				if (i >= this.locations.length) { i -= 1; }

				this.active_location_id = (i === -1 ? -1 : this.locations[i].id);

				this.loadLocations();
				this.loadDevices();
			}
	
		// export data
		break; case AppAction.APP_EXPORT:
			this.export();

		// clear data
		break; case AppAction.APP_CLEAR:
			this.clear();
		}
	}

	this.save();
};

App.prototype.handleKeyUp = function (event) {
	let action = event.target.dataset.action;
	let id = Number(event.target.dataset.id);

	if (action) {
		switch (action) {

		// new device
		case AppAction.DEVICE_NEW:
			if (event.key === "Enter" && this.active_location_id !== -1) {
				this.activeLocation().addDevice(
					document.getElementById("new-device-asset").value,
					document.getElementById("new-device-model").value,
					document.getElementById("new-device-type").value
				);
	
				this.loadDevices();
	
				document.getElementById("new-device-asset").value = "";
			}

		// rename location
		break; case AppAction.LOCATION_NAME:
			if (this.active_location_id !== -1) {
				this.locations.get(id).name = event.target.value;
				this.locations.get(id).updateDom();
			}

		// new location
		break; case AppAction.LOCATION_NEW:
			if (event.key === "Enter") {
				this.addLocation(event.target.value);
				this.updateDom();

				event.target.value = "";
			}

		// change device asset
		break; case AppAction.DEVICE_ASSET:
			this.activeLocation().getDevice(id).asset = event.target.value;
		}
	}

	this.save();
};