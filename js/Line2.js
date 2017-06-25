// =============================================================================
// Computational Geometry
// Fergus Kelley -- fergus@fergk.com
// =============================================================================

'use strict';

// Line2
// A line defined by two points

class Line2 {
	constructor(a, b) {
		// a and b are Vector2 objects
		this.a = a;
		this.b = b;
	}

	length() {
		return this.a.clone().sub(this.b).length();
	}
}