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
		// Returns a Vector2 representing center point of the line segment defined by endpoints a and b
		return new Vector2((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
	}

	at(t) {
		// Returns a Vector2 along the line, where t is the distance along the line
		// t=0 returns endpoint a, t=1 returns endpoint b, 0<t<1 will return a point on the line segment
		// Values outside this range will also work
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

		if (this.a.order(this.b) > 0) {
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
		// Returns true if the line segments intersect in any way.
		// Returns false if there is the segments are not equal, and do not overlap or intersect in any way.

		// outputTarget is an optional object reference to store the result:
		//	{
		//		type: null | 'equal' | 'intersection' | 'sharedEndpoint' | 'endpointOnSegment' | 'colinearOverlap'
		//		intersection: null | Vector2 | Line2
		//	}

		// epsilon is an optional parameter to overcome numerical precison issues that come with  floating point numbers. Setting this to a value >0 will result in detecting endpoint on segment intersections within the range of that value, effectively 'snapping' endpoints onto nearby line segments.

		// This doesn't gracefully handle precision issues with detecting colinearity of line segments with nearly identical angles (yet).

		// Some vocab for understanding the output:
		//		equal - both segments share the same endpoints
		//		intersection - a point at which two line segments intersect, not including endpoints
		//		shared endpoint - segments share one, but not both, endpoints
		//		endpoint on segment - an endpoint of one segment lies on the other segment
		//		colinear overlap - two segments are colinear, at least one endpoint of each segment lies on the other segment, and they are not equal

		// Adapted from this stack overflow answer:
		// https://stackoverflow.com/a/565282

		// =====================================================================

		var output = outputTarget || {}; // Optional object reference to put results in
		output.type = null;
		output.intersection = null;

		epsilon = epsilon || 0;

		// CASE A: Line segments are equal and exactly overlapping
		var aEqualsLa = this.a.equals(ls.a);
		var bEqualsLb = this.b.equals(ls.b);
		var aEqualsLb = this.a.equals(ls.b);
		var bEqualsLa = this.b.equals(ls.a);
		if ( (aEqualsLa && bEqualsLb) || (aEqualsLb && bEqualsLa) ) {
			output.type = 'equal';
			output.intersection = this.clone();
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
				output.intersection = new Line2( this.at(ts[0]), this.at(ts[1]));
				return true;
			}

	  	}

	  	// CASE C: Segments share one endpoint but do not overlap
		if ( aEqualsLa || aEqualsLb ) {
			output.type = 'sharedEndpoint';
			output.intersection = this.a.clone();
			return true;
		}
		if ( bEqualsLa || bEqualsLb ) {
			output.type = 'sharedEndpoint';
			output.intersection = this.b.clone();
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
	  	if ((u > 0) && (u < 1) && (t > 0) && (t < 1)) {
	  		output.type = 'intersection';
			output.intersection = this.at(t);
			return true;
	  	}

		// CASE E: The endpoint of one segment lies on the other segment
		var uEpsilon = epsilon / ls.length(); // Convert the epsilon from world units to parametric units
		if (Number.inEpsilon(u, 0, uEpsilon) || Number.inEpsilon(u, 1, uEpsilon)) {
			output.type = 'endpointOnSegment';
			output.intersection = ls.at(u);
			return true;
	  	}
		var tEpsilon = epsilon / this.length();
		if (Number.inEpsilon(t, 0, tEpsilon) || Number.inEpsilon(t, 1, tEpsilon)) {
			output.type = 'endpointOnSegment';
			output.intersection = this.at(t);
			return true;
	  	}

		// Returns false if there is no intersection
		return false;
	}
}

// var foo = new Line2(new Vector2(0, 2), new Vector2(50, -52));
// foo.order();
// console.log(foo);


// var bar = new Line2( new Vector2(20, 0), new Vector2(20, 10));
// var output = {};
// console.log(foo.intersects(bar, output, 0.5));
// console.log(output);

// console.log( foo.at(0) );
// console.log( foo.at(1) );
// console.log( foo.at(2) );
// console.log( foo.at(-2) );