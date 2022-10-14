class LocationDOM {
	parent;
	name;
	rename;
	count;
	remove;

	init(id) {
		let item = DOM(null, "div", {classList: "flex-box horizontal gap location", dataset: {action: AppAction.LOCATION_VIEW}});
		let cell1 = DOM(item, "div", {classList: "flex flex-box horizontal"});
		let name = DOM(cell1, "div", {innerHTML: this.name, classList: "flex location-name", dataset: {action: AppAction.LOCATION_VIEW}});

		let rename_cont = DOM(cell1, "div", {classList: "flex flex-box horizontal icon-input location-input-holder"});
		let rename_icon = DOM(rename_cont, "span", {innerHTML: "edit", classList: "material-symbols-outlined"});
		let rename = DOM(rename_cont, "input", {value: this.name, classList: "flex location-input", dataset: {action: AppAction.LOCATION_NAME}});
		let count = DOM(item, "div", {classList: "location-count", dataset: {action: AppAction.LOCATION_VIEW}});
		let remove = DOM(item, "button", {innerHTML: "close", classList: "material-symbols-outlined icon", dataset: {action: AppAction.LOCATION_REMOVE}, title: "Remove Location"});

		this.parent = item;
		this.name = name;
		this.rename = rename;
		this.count = count;
		this.remove = remove;

		this.parent.dataset.id = id;
		this.name.dataset.id = id;
		this.rename.dataset.id = id;
		this.count.dataset.id = id;
		this.remove.dataset.id = id;
	}
}