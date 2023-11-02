/** Shuffles an array in place. This is mutative! */
export function shuffleArrayInPlace<T>(arr: Array<T>): Array<T> {
	let currentIndex = arr.length;
	let temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = arr[currentIndex];
		arr[currentIndex] = arr[randomIndex];
		arr[randomIndex] = temporaryValue;
	}

	return arr;
}

/** Creates a "deck" from an array, and then allows drawing from it without replacement until all items have
 * been drawn.
 *
 * Uses the exact array that is input so pass a copy if you are going to be using that array elsewhere!
 */
export class DeckRandomizer<T> {
	private items: Array<T>;
	private _pointer: number;

	constructor(arr: Array<T>) {
		// Sets directly to input array to allow for TypedArrays
		this.items = arr;
		shuffleArrayInPlace(this.items);

		this._pointer = 0;
	}

	draw(): T {
		if (this._pointer >= this.items.length) {
			this.reshuffleDeck();
		}
		const item = this.items[this._pointer];
		this._pointer += 1;
		return item;
	}

	drawMultiple(count: number): T[] {
		if (count > this.items.length) {
			throw Error('cannot pick that many random items');
		}

		const itemsRemaining = this.items.length - this._pointer;
		if (count > itemsRemaining) {
			const initialItems = this.items.slice(this._pointer);
			this.reshuffleDeck();
			const nextSetOfItems = this.items.slice(0, count - initialItems.length);
			return [...initialItems, ...nextSetOfItems];
		} else {
			return this.items.slice(this._pointer, this._pointer + count);
		}
	}

	reshuffleDeck(): void {
		this._pointer = 0;
		shuffleArrayInPlace(this.items);
	}
}
