// =============================================================================
// Computational Geometry
// Fergus Kelley -- fergus@fergk.com
// =============================================================================

'use strict';

// PlaneSweep
// An implementation of the plane sweep / line sweep / Bentley–Ottmann algorithm adapted from:
//	Ch.2 of [Computational Geometry: Algorithms and Applications](http://www.cs.uu.nl/geobook/)
//	https://en.wikipedia.org/wiki/Bentley–Ottmann_algorithm
//	http://jeffe.cs.illinois.edu/teaching/373/notes/x06-sweepline.pdf
//	[Computing intersections in a set of line segments: the Bentley-Ottmann algorithm](http://people.scs.carleton.ca/~michiel/lecturenotes/ALGGEOM/bentley-ottmann.pdf)

// This implementation uses a horizontal line that sweeps from top to bottom

// This doesn't work... yet.

class PlaneSweep {
	constructor(...args) { // Line2
		this.lineList = [];
		this.eventQueue = [];
  		this.sweepStatus = [];
  		this.intersections = [];
		
		for (let line of args) {
			this.addLine(line);
  		}

  		this.findIntersections();

  		return this;
	}

	addLine(line) {
		line.order();
    	this.lineList.push(line);
    	this.addEventPoint(line.a, 'upper', line);
    	console.log(this.eventQueue);
    	this.addEventPoint(line.b, 'lower', line);
    	console.log(this.eventQueue);
	}

	addEventPoint(point, type, line) {

		var newEventPoint = new EventPoint(point, type, line);

		// TODO, check if this point is already in the queue and if we need to add more lines to it

		if (this.eventQueue.length === 0) { // First point, just put it in the queue
			this.eventQueue.push(newEventPoint);
			return newEventPoint;
		}

		for (var i = 0; i < this.eventQueue.length; i++) { // Compare each point and figure out where it goes
			if (this.eventQueue[i].point.order(point) > 0) {
				this.eventQueue.splice(i, 0, newEventPoint);
				return newEventPoint;
			}
		}
		
		this.eventQueue.push(newEventPoint); // We've reached the end, so put it in the queue
		return newEventPoint;
	}

	findIntersections() {
		while(this.eventQueue.length > 0) {
			// Get the next event point, remove it from the queue, and process it
			var nextEventPoint = this.eventQueue.shift(); 
			this.handleEventPoint(nextEventPoint);
		}
	}

	handleEventPoint(eventPoint) {
		// Test intersections of adjacent points
		eventPoint
	}
}

class EventPoint {
	constructor(point, type, line) {
		this.point = point;
		this.type = type; // upper | lower | intersection
		this.lines = [];
		this.lines.push(line);
	}
}

var foo = new PlaneSweep(
	new Line2(new Vector2(0, 0), new Vector2(50, 50)),
	new Line2(new Vector2(30, 5), new Vector2(25, 75)),
	new Line2(new Vector2(60, 40), new Vector2(70, 10))
);
console.log(foo);