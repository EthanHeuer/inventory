App.prototype.handleClick = function (event) {
	let action = event.target.dataset.action;
	let device_id = Number(event.target.dataset.device);

	if (action) {
		switch (action) {

		// select a location to view
		case AppAction.TOGGLE_LOCATION:
			this.active_location_id = Number(event.target.dataset[action]);

			this.updateDom();
			this.loadDevices();

		// change devices type
		break; case AppAction.DEVICE_TYPE:
			this.activeLocation().getDevice(device_id).type = event.target.value;

		// change devices model
		break; case AppAction.DEVICE_MODEL:
			this.activeLocation().getDevice(device_id).model = event.target.value;
		
		// remove device from active location
		break; case AppAction.DEVICE_REMOVE:
			for (let i = 0; i < this.activeLocation().devices.length; i ++) {
				if (this.activeLocation().devices[i].id === device_id) {
					this.activeLocation().devices.splice(i, 1);
					break;
				}
			}

			this.loadDevices();
			this.activeLocation().updateDom();
		
		// remove location
		break; case AppAction.LOCATION_REMOVE:
			let remove_id = Number(event.target.getAttribute(`data-location`));

			let i;
			for (i = 0; i < this.locations.length; i ++) {
				if (this.locations[i].id === remove_id) { break; }
			}

			if (window.confirm(`Are you sure you want to delete ${this.locations[i].name} and all of its devices?`)) {
				this.locations.splice(i, 1);

				if (i >= this.locations.length) { i -= 1; }

				if (i === -1) {
					this.active_location_id = -1;
				} else {
					this.active_location_id = this.locations[i].id;
				}

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

	if (action && event.key === "Enter") {
		if (action === AppAction.DEVICE_NEW && this.active_location_id !== -1) {
			this.activeLocation().addDevice(
				document.getElementById("new-device-asset").value,
				document.getElementById("new-device-model").value,
				document.getElementById("new-device-type").value
			);

			this.loadDevices();

			document.getElementById("new-device-asset").value = "";

		} else if (action === AppAction.LOCATION_NAME && this.active_location_id !== -1) {
			let location_id = Number(event.target.dataset.location);
			this.getLocation(location_id).name = event.target.value;
			this.getLocation(location_id).updateDom();

		} else if (action === AppAction.LOCATION_NEW) {
			this.addLocation(event.target.value);
			this.updateDom();

			event.target.value = "";

		} else if (action === AppAction.DEVICE_ASSET) {
			let device_id = Number(event.target.dataset.device);

			this.activeLocation().getDevice(device_id).asset = event.target.value;
		}
	}

	this.save();
};