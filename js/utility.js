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

function toggleClass(node, bool, className) {
	if (bool) {
		node.classList.add(className);
	} else {
		node.classList.remove(className);
	}
}

class ArrayMapItem {
	id;

	constructor (id) {
		this.id = id;
	}
}

class ArrayMap {
	#data = [];

	getIndex(id) {
		for (let i = 0; i < this.#data.length; i ++) {
			if (this.#data[i].id === id) {
				return i;
			}
		}

		return -1;
	}

	get(id) { return this.#data[this.getIndex(id)]; }

	at(index) { return this.#data[index]; }

	push(... items) { this.#data.push(... items); }

	length() { return this.#data.length; }
}