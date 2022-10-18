App.prototype.export = function () {
	let data = [
		["Location", "Asset", "Year", "Model", "Type"],
		[]
	];

	for (let l = 0; l < this.locations.length(); l ++) {
		data.push(... this.locations.at(l).export());
	}

	// find all unique device identifiers
	let unique = [];

	for (let r = 2; r < data.length; r ++) {
		let isUnique = true;

		for (let u = 0; u < unique.length; u ++) {
			if (data[r][2] === unique[u][0] && data[r][3] === unique[u][1] && data[r][4] === unique[u][2]) {
				isUnique = false;
				break;
			}
		}

		if (isUnique) {
			unique.push([data[r][2], data[r][3], data[r][4]]);
		}
	}

	// sort all identifies
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
		data[0].push(unique[u].join(" "));

		for (let r = 2; r < data.length; r ++) {
			data[r].push("");
		}
	}

	// add device asset to identifier row
	for (let r = 2; r < data.length; r ++) {
		for (let u = 0; u < unique.length; u ++) {
			if (data[r][2] === unique[u][0] && data[r][3] === unique[u][1] && data[r][4] === unique[u][2]) {
				data[r][5 + u] = data[r][1];
			}
		}
	}

	let column_char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let MAX = data.length;

	for (let d = 0; d < data[0].length; d ++) {
		if (d > 4 || d === 1) {
			data[1][d] = `=COUNTA(${column_char[d]}3:${column_char[d]}${MAX})`;
		} else if (d === 0) {
			data[1][d] = `=COUNTA(UNIQUE(${column_char[d]}3:${column_char[d]}${MAX}))`;
		}
	}

	// format
	let res = [];

	for (let r = 0; r < data.length; r ++) {
		res.push(data[r].join("\t"));
	}

	// download
	let a = window.document.createElement("a");
	a.href = window.URL.createObjectURL(new Blob([res.join("\n")], {type: 'text/tsv'}));
	a.download = `${document.getElementById("sheet-name").value}.tsv`;

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};