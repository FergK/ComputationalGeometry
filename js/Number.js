// =============================================================================
// Computational Geometry
// Fergus Kelley -- fergus@fergk.com
// =============================================================================

'use strict';

Number.inEpsilon = function(i, j, e) {
	// Returns true if i is equal to j within a given epsilon: (j-e) <= i <= (j+e)
	if ( (i>=(j-e)) && (i<=(j+e)) ) {
		return true;
	}
	return false;
}