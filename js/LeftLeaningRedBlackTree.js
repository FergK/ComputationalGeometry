// =============================================================================
// Computational Geometry
// Fergus Kelley -- fergus@fergk.com
// =============================================================================

'use strict';

// LLRB
// Adapted from http://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
class LLRBNode {
	constructor(key, value) {
		this.key = key;
		this.value = value;
		this.isRed = true; // New nodes are always red
		this.left = null;
		this.right = null;
		this.parent = null;
	}

	flipColors() {
		this.isRed = !this.isRed;
		this.left.isRed = !this.left.isRed;
		this.right.isRed = !this.right.isRed;
	}
}

class LLRB {

	constructor(key, value, compareFunction) {
		this.root = new LLRBNode(key, value);
		this.root.isRed = false;
		this.compare = compareFunction;
	}

	rotateLeft(h) {
		var x = h.right;
		h.right = x.left;
		x.left = h;
		x.isRed = h.isRed;
		h.isRed = true;
		return x;
	}

	rotateRight(h) {
		var x = h.left;
		h.left = x.right;
		x.right = h;
		x.isRed = h.isRed;
		h.isRed = true;
		return x;
	}

	search(key) {
		var x = this.root;
		while( x !== null ) {
			var cmp = this.compare(key, x.key);
			if (cmp == 0) { return x.val; }
			else if (cmp < 0) { x = x.left;	}
			else if (cmp > 0) { x = x.right; }
		}
		return null;
	}

	insert(h, key, value) {
		if (h == null) { return new LLRBNode(key, value); }

		if ( (h.left !== null) && h.left.isRed && (h.right !== null) && h.right.isRed) { h.isRed = !h.isRed; }

		var cmp = this.compare(key, h.key);
		if (cmp == 0) { h.value = value; }
		else if (cmp < 0) { h.left = this.insert(h.left, key, value); }
		else { h.right = this.insert(h.right, key, value); }

		if (h.right.isRed && !h.left.isRed) { h = this.rotateLeft(h); }
		if (h.left.isRed && h.left.left) { h = this.rotateRight(h); }

		return h;
	}
}

// var foo = new LLRB( 50, 50, function(a, b) { return a - b; });
// foo.insert( foo.root, 25, 25 );
// foo.insert( foo.root, 10, 10 );

// console.log(foo);