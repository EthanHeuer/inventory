/**
 * Creates a DOM element and appends it to the parent
 * @param {HTMLElement} parent parent node of the element
 * @param {String} tagName tag name of the element
 * @param {Object} tags HTML attributes of the element
 * @returns {HTMLElement} the resulting HTML element
 */
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



/**
 * Toggle a class based on a boolean value on a given node
 * @param {HTMLElement} node HTML element to add or remove the class
 * @param {Boolean} bool boolean value
 * @param {String} className class to add or remove
 */
function toggleClass(node, bool, className) {
	if (bool) {
		node.classList.add(className);
	} else {
		node.classList.remove(className);
	}
}



/**
 * Item to be used in an ArrayMap
 */
class ArrayMapItem {
	key;

	/**
	 * @param {String} key
	 */
	constructor (key) {
		this.key = key;
	}
}



/**
 * A mapping object that supports calling enteries by key or index
 */
class ArrayMap {
	#data = [];

	/**
	 * Get the index of element by the key
	 * @param {String} key key of the element
	 */
	getIndex(key) {
		for (let i = 0; i < this.#data.length; i ++) {
			if (this.#data[i].key === key) return i;
		}

		return -1;
	}

	/**
	 * Get element by key
	 * @param {String} key key of the element
	 * @return {ArrayMapItem | null}
	 */
	get(key) {
		let index = this.getIndex(key);

		if (index !== -1) {
			return this.#data[index];
		}

		return null;
	}

	/**
	 * Get element by index
	 * @param {Integer} index array index
	 * @return {ArrayMapItem}
	 */
	at(index) {
		if (index >= 0 && index < this.#data.length) {
			return this.#data[index];
		}

		return null;
	}

	/**
	 * Append elements to the back of the map
	 * @param {... ArrayMapItem} items items to be appended
	 */
	push(... items) { this.#data.push(... items); }
	
	/**
	 * Remove an element from the map
	 * @param {String} id id in the map to be removed
	 * @return {ArrayMapItem} element that was removed from the map
	 */
	remove(id) {
		let index = this.getIndex(id);

		if (index !== -1) {
			return this.#data.splice(index, 1);
		}

		return null;
	}

	/**
	 * Get the length of the map
	 * @return {Number}
	 */
	length() { return this.#data.length; }

	/**
	 * Return the last item in the list
	 */
	back() { return this.#data[this.#data.length - 1]; }
}