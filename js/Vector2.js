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
		return this;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	clone() {
		// Returns a copy of this vector
		return new Vector2(this.x, this.y);
	}

	copy(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
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
		return this;
	}

	dot(v) {
		return (this.x * v.x) + (this.y * v.y);
	}

	cross(v) {
		return (this.x * v.y) - (this.y * v.x);
	}

	equals(v) {
		return ((this.x === v.x) && (this.y === v.y));
	}

	inOrder(v) {
		// Returns true if:
		//		This point is above v (this.y > v.y)
		// 		Y-values are equal, and this point is left of or overlapping v (this.x < v.x)
		// Otherwise returns false

		if (this.y > v.y) { // If this point is above v
			return true;
		} else if (this.y === v.y) { // If y-values are equal
			if (this.x <= v.x) { // Check if this point is left of or overlapping v
				return true;
			}
		}
		
		return false;
	}
}

// var foo = new Vector2(1, 2);
// var bar = new Vector2(3, 4);
// console.log( foo.cross(bar) );