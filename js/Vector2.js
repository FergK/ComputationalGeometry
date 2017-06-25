// =============================================================================
// Computational Geometry
// Fergus Kelley -- fergus@fergk.com
// =============================================================================

'use strict';

// Vector2
// 2D Vector, point on a plane, or ordered pair

class Vector2 {
	constructor(x, y) {
		this.x = (x !== undefined) ? x : 0;
		this.y = (y !== undefined) ? y : 0;
	}

	length() {
		return Math.hypot(this.x, this.y)
	}

	lengthSquared() {
		return Math.pow(this.x, 2) + Math.pow(this.y, 2);
	}
	
	add(v) {
		// Adds a vector to this vector
		// v is a Vector 2
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	sub(v) {
		// Subtracts a vector from this vector
		// v is a Vector 2
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	normalize() {
		// Normalizes this vector (sets it to a unit vector with the same direction)
		var length = this.length();
		this.x /= length;
		this.y /= length;
		return this;
	}

	normalized() {
		// Returns a copy of this vector that has been normalized
		var length = this.length();
		return new Vector2((this.x / length), (this.y / length))
	}

	scale(s) {
		// Scales this vector by scalar s
		this.x *= s;
		this.y *= s;
	}

	dot(x, y) {
		return (this.x * x) + (this.y * y);
	}

	clone() {
		// Returns a copy of this vector
		return new Vector2(this.x, this.y);
	}
}
