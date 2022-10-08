function DOM(parent, tagName, tags = {}) {
	let el = document.createElement(tagName);

	if (parent !== null) {
		parent.appendChild(el);
	}

	for (let key of Object.keys(tags)) {
		if (typeof tags[key] === "object") {
			for (let subkey of Object.keys(tags[key])) {
				el[key][subkey] = tags[key][subkey];
			}
		} else {
			el[key] = tags[key];
		}
	}

	return el;
}