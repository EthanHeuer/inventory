const MAIN = (() => {
	var app = new App();
	var DATE = new Date();
	document.getElementById("sheet-name").value = `inventory-${DATE.getMonth() + 1}-${DATE.getDate()}-${DATE.getFullYear()}`;
	app.init();
	app.loadLocations();
	app.loadDevices();
})();