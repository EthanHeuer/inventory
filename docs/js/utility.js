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

	get(id) {
		let index = this.getIndex(id);

		if (index !== -1) {
			return this.#data[index];
		}

		return null;
	}

	at(index) {
		if (index >= 0 && index < this.#data.length) {
			return this.#data[index];
		}
	}

	push(... items) { this.#data.push(... items); }
	
	remove(id) {
		let index = this.getIndex(id);

		if (index !== -1) {
			return this.#data.splice(index, 1);
		}

		return null;
	}
	length() { return this.#data.length; }
}