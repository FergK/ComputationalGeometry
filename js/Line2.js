// =============================================================================
// Computational Geometry
// Fergus Kelley -- fergus@fergk.com
// =============================================================================

'use strict';

// Line2
// 2D line or line segment

class Line2 {
	constructor(a, b) {
		// a and b are Vector2 objects
		this.a = a.clone();
		this.b = b.clone();
		return this;
	}

	set(a, b) {
		// a and b are Vector2 objects
		this.a = a.clone();
		this.b = b.clone();
		return this;
	}

	clone() {
		// Returns a copy of this line
		return new Line2(this.a, this.b);
	}

	length() {
		// Returns the scalar length of the line segment defined by endpoints a and b
		return this.a.clone().sub(this.b).length();
	}

	pointsEqual() {
		// Returns true if a and b are the same point
		return this.a.equals(this.b);
	}

	center() {
		// Returns a Vector 2 representing center point of the line segment defined by endpoints a and b
		return new Vector2((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
	}

	at( t ) {
		return this.b.clone().sub(this.a).scale(t).add(this.a);
	}

	swap() {
		// Swaps the two endpoints
		var c = this.a.clone();
		this.a.copy(this.b);
		this.b.copy(c);
		return this;
	}

	order() {
		// Sets the existing endpoints such that a is the upper endpoint and b is the lower endpoint
		// If y-values are equal, a is set to the left-most point
		// If both points are equal, do nothing

		if (!this.a.inOrder(this.b)) {
			this.swap();
		}

		return this;
	}

	equals(ls) {
		// Returns true if ls shares the same endpoints as this line segment
		if ( 
			( this.a.equals(ls.a) && this.b.equals(ls.b) ) ||
			( this.a.equals(ls.b) && this.b.equals(ls.a) )
		) {
			return true;
		}
		return false;
	}

	intersects( ls, outputTarget, epsilon ) {
		// Checks if two line segments are intersecting
		// Some of this is adapted from two stack overflow answers:
		// https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
		// https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js

		// Returns false if there is the segments are not equal, and do not overlap or intersect in any way.

		// Returns an object containing the type of result (equal, shared endpoint, endpoint on segment, overlapping colinear, or intersecting) and the result (Vector2 or Line2)

		// Some vocab:
		//		equal - both segments share the same endpoints
		//		shared endpoint - segments share one, but not both, endpoints
		//		endpoint on segment - an endpoint of one segment lies on the other segment
		//		colinear overlap - two segments are colinear, at least one endpoint of each segment lies on the other segment, and they are not equal
		//		intersection - a point at which two line segments intersect, not including endpoints

		// When comparing the stack overflow answer to this code:
		// p and p2 correspond to this.a and this.b
		// q and q2 correspond to ls.a and ls.b

		// TODO: Check overlapping endpoints and endpoints on segment using an epsilon to handle floating point errors

		// =====================================================================

		var output = outputTarget || {}; // Optional object reference to put results in
		output.type = 'none';
		output.result = null;

		// CASE A: Line segments are equal and exactly overlapping
		var aEqualsLa = this.a.equals(ls.a);
		var bEqualsLb = this.b.equals(ls.b);
		var aEqualsLb = this.a.equals(ls.b);
		var bEqualsLa = this.b.equals(ls.a);
		if ( (aEqualsLa && bEqualsLb) || (aEqualsLb && bEqualsLa) ) {
			output.type = 'equal';
			output.result = this.clone();
			return true;
		}

		// These are adapted from the stack overflow answer
		var r = this.b.clone().sub(this.a); // p2 - p
		var s = ls.b.clone().sub(ls.a); // q2 - q
		var qsubp = ls.a.clone().sub(this.a); // q - p
		var uNumerator = qsubp.cross(r); // (q - p) cross r
		var uDenominator = r.cross(s); // r cross s

		if (uNumerator === 0 && uDenominator === 0) {
			// Segments are colinear
			// t0 and t1 are how far along this segment the endpoints of ls lie
			var rdotr = r.dot(r);
	  		var t0 = qsubp.dot(r) / rdotr;
	  		var t1 = qsubp.clone().add(s).dot(r) / rdotr;
	  		
	  		if ( // Check if they overlap
				( (t0 > 0) && (t0 < 1) ) ||
				( (t1 > 0) && (t1 < 1) ) ||
				( (t0 < 0) && (t1 > 1) ) ||
				( (t1 < 0) && (t0 > 1) )
			) {
				// CASE B: Line segments are colinear and partially overlapping
				// Find the endpoints of the overlapping segment and output that line segment
				var ts = [0, 1, t0, t1].sort(function(a, b) { return a - b; }).slice(1, 3);
				output.type = 'colinearOverlap';
				output.result = new Line2( this.at(ts[0]), this.at(ts[1]));
				return true;
			}

	  	}

	  	// CASE C: Segments share one endpoint but do not overlap
		if ( aEqualsLa || aEqualsLb ) {
			output.type = 'sharedEndpoint';
			output.result = this.a.clone();
			return true;
		}
		if ( bEqualsLa || bEqualsLb ) {
			output.type = 'sharedEndpoint';
			output.result = this.b.clone();
			return true;
		}

	  	if ( uDenominator === 0 ) {
	  		// Segments are parallel and non overlapping
			return false;
	  	}

	  	// Segments are non-parallel, we need to check if they intersect
	  	var u = uNumerator / uDenominator;
	  	var t = qsubp.cross(s) / uDenominator;

	  	// CASE D: Segments are intersecting, not including endpoints
		// TODO: Use an epsilon here
	  	if ((u > 0) && (u < 1) && (t > 0) && (t < 1)) {
	  		output.type = 'intersecting';
			output.result = this.at(t);
			return true;
	  	}

		// CASE E: The endpoint of one segment lies on the other segment
		// TODO: Use an epsilon here
		if ((u === 0) || (u === 1)) {
	  		output.type = 'endpointOnSegment';
			output.result = ls.at(u);
			return true;
	  	}
		if ((t === 0) || (t === 1)) {
	  		output.type = 'endpointOnSegment';
			output.result = this.at(t);
			return true;
	  	}

		// Returns false if there is no intersection
		return false;
	}
}

// var foo = new Line2( new Vector2(0, 0), new Vector2(100, 0));
// var bar = new Line2( new Vector2(-20, 0), new Vector2(-10, 0));
// var output = {};
// console.log(foo.intersects(bar, output));
// console.log(output);

// console.log( foo.at(0) );
// console.log( foo.at(1) );
// console.log( foo.at(2) );
// console.log( foo.at(-2) );