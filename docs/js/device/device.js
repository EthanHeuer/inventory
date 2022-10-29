/**
 * Enum for a device model
 */
class DeviceModel {
	static HP = "HP";
	static MAC = "Mac";
}

/**
 * Enum for a device type
 */
class DeviceType {
	static STUDENT = "Student";
	static LOANER = "Loaner";
	static FACULTY = "Faculty";
}

class Device extends ArrayMapItem {
	asset;
	year = "";
	model = "";
	type = "";
	tag;
	time;
	dom;

	static REGEX = [
		[/^(?<year>\d\d\d\d)(?<purpose>550)(?<id>\d\d)$/m, ["HP", "Loaner", true]],
		[/^(?<year>\d\d\d\d)(?<purpose>554)(?<id>\d\d)$/m, ["Mac", "Loaner", true]],
		[/^(?<year>\d\d\d\d)(?<purpose>11)(?<id>\d\d\d)$/m, ["HP", "Student", true]],
		[/^(?<year>\d\d\d\d)(?<purpose>20)(?<id>\d\d\d)$/m, ["Mac", "Student", true]],
		[/^C-(?<id>\d\d\d\d\d)$/m, ["", "Faculty", false]],
		[/^LP-(?<id>\d\d\d\d)$/m, ["Printer", "", false]]
	];

	constructor (asset, id) {
		super(id);

		this.asset = asset;
		this.time = Date.now();
		this.dom = new DeviceDOM(id);

		this.readAsset();
		this.updateDom();
	}

	readAsset() {
		for (let r = 0; r < Device.REGEX.length; r ++) {
			let res = Device.REGEX[r][0].exec(this.asset);

			if (res !== null) {
				this.model = Device.REGEX[r][1][0];
				this.type = Device.REGEX[r][1][1];

				if (Device.REGEX[r][1][2]) {
					this.year = res.groups.year;
				}

				break;
			}
		}
	}

	updateDom() {
		this.dom.tag.innerHTML = "";

		[this.asset, this.year, this.model, this.type].forEach(e => {
			if (e !== "") {
				DOM(this.dom.tag, "span", {innerHTML: e, classList: "tag"});
			}
		});
	}

	export() {
		return [this.asset, this.year, this.model, this.type];
	}
}