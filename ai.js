function defaultAI(stage, me, enemyPosition) { 
	var DistanceToPoint = function(from, to) {
		var dist = 0;

		if (from[0] >= to[0]) {
			dist += from[0] - to[0];
		} else {
			dist += to[0] - from[0];
		}

		if (from[1] >= to[1]) {
			dist += from[1] - to[1];
		} else {
			dist += to[1] - from[1];
		}

		return dist;
	}
	var MoveToPoint = function(to) {
		if (me.direction == "north" && to[0] > me.x) {
			me.TurnRight();
		} else if (me.direction == "north" && to[0] < me.x) {
			me.TurnLeft();
		} 

		else if (me.direction == "south" && to[0] > me.x) {
			me.TurnLeft();
		} else if (me.direction == "south" && to[0] < me.x) {
			me.TurnRight();
		}

		else if (me.direction == "west" && to[1] < me.y) {
			me.TurnRight();
		} else if (me.direction == "west" && to[1] > me.y) {
			me.TurnLeft();
		}

		else if (me.direction == "east" && to[1] < me.y) {
			me.TurnLeft();
		} else if (me.direction == "east" && to[1] > me.y) {
			me.TurnRight();
		}
	}
	var CheckCollisions = function() {
		var colDir = new Array(4);
			colDir[0] = "";
			colDir[3] = "";
			colDir[2] = "";
			colDir[1] = "";

		if (me.y - 1 < 0 || stage[me.x][me.y - 1][0] != STAGECOLOR) {
			colDir[0] = "north";
		}
		
		if (me.x - 1 < 0 || stage[me.x - 1][me.y][0] != STAGECOLOR) {
			colDir[3] = "west";
		}
		
		if (me.y + 1 > STAGEHEIGHT - 1 || stage[me.x][me.y + 1][0] != STAGECOLOR) {
			colDir[2] = "south";
		}
		
		if (me.x + 1 > STAGEWIDTH - 1 || stage[me.x + 1][me.y][0] != STAGECOLOR) {
			colDir[1] = "east";
		}

		return colDir;
	}
	var TotalCollisions = function() {
		totCol = 0;

		if (CheckCollisions()[0] != "") {
			totCol += 1;
		}
		if (CheckCollisions()[1] != "") {
			totCol += 1;
		}
		if (CheckCollisions()[2] != "") {
			totCol += 1;
		}
		if (CheckCollisions()[3] != "") {
			totCol += 1;
		}

		return totCol;
	}
	var EvadeDeadEnd = function() {
		if (me.direction == "north") {
			me.y -= 1;
			if (TotalCollisions() == 4) {
				if (CheckCollisions()[1] == "") {
					me.TurnRight();
				} else {
					me.TurnLeft();
				}
			}
			me.y += 1;
		}
		if (me.direction == "south") {
			me.y += 1;
			if (TotalCollisions() == 4) {
				if (CheckCollisions()[1] == "") {
					me.TurnLeft();
				} else {
					me.TurnRight();
				}
			}
			me.y -= 1;
		}
		if (me.direction == "east") {
			me.x += 1;
			if (TotalCollisions() == 4) {
				if (CheckCollisions()[0] == "") {
					me.TurnLeft();
				} else {
					me.TurnRight();
				}
			}
			me.x -= 1;
		} 
		if (me.direction == "west") {
			me.x -= 1;
			if (TotalCollisions() == 4) {
				if (CheckCollisions()[0] == "") {
					me.TurnRight();
				} else {
					me.TurnLeft();
				}
			}
			me.x += 1;
		}
	}
	var DoRandomAction = function() {
		if (DistanceToPoint([me.x, me.y], point) > DistanceToPoint(enemyPosition, point)
			&& me.direction == "north") {
			point[0] += Math.floor(Math.random()*2)-(1 - Math.floor(Math.random()));
			point[1] += 1;
		} else if (DistanceToPoint([me.x, me.y], point) > DistanceToPoint(enemyPosition, point)
			&& me.direction == "south") {
			point[0] += Math.floor(Math.random()*2)-(1 - Math.floor(Math.random()));
			point[1] -= 1;
		} else if (DistanceToPoint([me.x, me.y], point) > DistanceToPoint(enemyPosition, point)
			&& me.direction == "east") {
			point[0] += 1;
			point[1] += Math.floor(Math.random()*2)-(1 - Math.floor(Math.random()));
		} else if (DistanceToPoint([me.x, me.y], point) > DistanceToPoint(enemyPosition, point)
			&& me.direction == "west") {
			point[0] -= 1;
			point[1] += Math.floor(Math.random()*2)-(1 - Math.floor(Math.random()));
		}
	}
	var EvadeCollision = function() {
		//console.log(TotalCollisions());
		if (TotalCollisions() == 3) {
			//DoRandomAction();
			if (CheckCollisions()[0] == "") {
				me.direction = "north";
			} else if (CheckCollisions()[1] == "") {
				me.direction = "east";
			} else if (CheckCollisions()[2] == "") {
				me.direction = "south";
			} else if (CheckCollisions()[3] == "") {
				me.direction = "west";
			}
		} else if (TotalCollisions() == 2) {
			if (CheckCollisions()[0] == me.direction || 
				CheckCollisions()[1] == me.direction || 
				CheckCollisions()[2] == me.direction || 
				CheckCollisions()[3] == me.direction) {
				me.TurnLeft();
			}
			if (CheckCollisions()[0] == me.direction || 
				CheckCollisions()[1] == me.direction || 
				CheckCollisions()[2] == me.direction || 
				CheckCollisions()[3] == me.direction) {
				me.TurnRight();
				me.TurnRight();
			}
		} else if (TotalCollisions() == 0) {
			MoveToPoint(enemyPosition);
		}
	}

	if (DistanceToPoint([me.x, me.y], enemyPosition) < 10 || TotalCollisions() >= 2) {
		var point = new Array(2);
		var specificDistance = 0;
		point = enemyPosition;

		MoveToPoint(point);

		/*
		if (me.x == enemyPosition[0] || me.y == enemyPosition[1]) {
			specificDistance = 0;
		} else {
			specificDistance = 2;
		}*/

		if (DistanceToPoint([me.x, me.y], enemyPosition) <= 1) {
			if (me.direction == "north") {
				me.direction = "south";
			} else if (me.direction == "east") {
				me.direction = "west";
			} else if (me.direction == "south") {
				me.direction = "north";
			} else if (me.direction == "west") {
				me.direction = "east";
			}
		} else {

		}

		EvadeCollision();
		//EvadeDeadEnd();
		EvadeCollision();
	} else if (TotalCollisions() == 1) {
		me.TurnLeft();

		EvadeCollision();
		//EvadeDeadEnd();
	} else {
		me.TurnRight();
		EvadeCollision();
		//EvadeDeadEnd();
	}
	return me; 
}

function defaultAI2(stage, me, enemyPosition) { 
  function nope(direction) {
	switch(direction) {
	case "east":
	    if (!stage[me.x+1] || stage[me.x+1][me.y][0] != STAGECOLOR)
		return true;
	    break;
	case "west":
	    if (!stage[me.x-1] || stage[me.x-1][me.y][0] != STAGECOLOR)
		return true;
	    break;
	case "south":
	    if (!stage[me.x][me.y+1] || stage[me.x][me.y+1][0] != STAGECOLOR)
		return true;
	    break;
	case "north":
	    if (!stage[me.x][me.y-1] || stage[me.x][me.y-1][0] != STAGECOLOR)
		return true;
	    break;
	default:
	    return false;
	}
	return false;
    }
    
    if (Math.abs(enemyPosition[0] - me.x) > Math.abs(enemyPosition[1] - me.y))
	if (enemyPosition[0] > me.x) {
	    me.direction = "north";
	} else {
	    me.direction = "south";
	}
    else
	if (enemyPosition[1] > me.y) {
	    me.direction = "east";
	} else {
	    me.direction = "west";
	}

    var i;
    if (nope(me.direction))
	for (i=0;i<4;i++)
	    if (nope(me.direction)) {
		me.TurnLeft();
	    } else
		break;
    return me;
}

function defaultAI3(stage, me, enemyPosition) {
    function nope(direction) {
	switch(direction) {
	case "east":
	    if (!stage[me.x+1] || stage[me.x+1][me.y][0] != STAGECOLOR)
		return true;
	    break;
	case "west":
	    if (!stage[me.x-1] || stage[me.x-1][me.y][0] != STAGECOLOR)
		return true;
	    break;
	case "south":
	    if (!stage[me.x][me.y+1] || stage[me.x][me.y+1][0] != STAGECOLOR)
		return true;
	    break;
	case "north":
	    if (!stage[me.x][me.y-1] || stage[me.x][me.y-1][0] != STAGECOLOR)
		return true;
	    break;
	default:
	    return false;
	}
	return false;
    }
    
    function yep(direction) {
	switch(direction) {
	case "north":
	    if (stage[me.x-1] && stage[me.x-1][me.y+1] && stage[me.x-1][me.y] && stage[me.x-1][me.y+1][0] != STAGECOLOR && stage[me.x-1][me.y][0] == STAGECOLOR) {
		me.TurnLeft();
	    } else if (stage[me.x+1] && stage[me.x+1][me.y+1] && stage[me.x+1][me.y] && stage[me.x+1][me.y+1][0] != STAGECOLOR && stage[me.x+1][me.y][0] == STAGECOLOR) {
		me.TurnRight();
	    }
	    break;
	case "south":
	    if (stage[me.x-1] && stage[me.x-1][me.y-1] && stage[me.x-1][me.y] && stage[me.x-1][me.y-1][0] != STAGECOLOR && stage[me.x-1][me.y][0] == STAGECOLOR) {
		me.TurnRight();
	    } else if (stage[me.x+1] && stage[me.x+1][me.y-1] && stage[me.x+1][me.y] && stage[me.x+1][me.y-1][0] != STAGECOLOR && stage[me.x+1][me.y][0] == STAGECOLOR) {
		me.TurnLeft();
	    }
	    break;
	case "east":
	    if (stage[me.x-1] && stage[me.x-1][me.y+1] && stage[me.x][me.y+1] && stage[me.x-1][me.y+1][0] != STAGECOLOR && stage[me.x][me.y+1][0] == STAGECOLOR) {
		me.TurnRight();
	    } else if (stage[me.x-1] && stage[me.x-1][me.y-1] && stage[me.x][me.y-1] && stage[me.x-1][me.y-1][0] != STAGECOLOR && stage[me.x][me.y-1][0] == STAGECOLOR) {
		me.TurnLeft();
	    }
	    break;
	case "west":
	    if (stage[me.x+1] && stage[me.x+1][me.y+1] && stage[me.x][me.y+1] && stage[me.x+1][me.y+1][0] != STAGECOLOR && stage[me.x][me.y+1][0] == STAGECOLOR) {
		me.TurnLeft();
	    } else if (stage[me.x+1] && stage[me.x+1][me.y-1] && stage[me.x][me.y-1] && stage[me.x+1][me.y-1][0] != STAGECOLOR && stage[me.x][me.y-1][0] == STAGECOLOR) {
		me.TurnRight();
	    }
	    break;
	default:
	    break;
	}
    }

    var i;
    if (nope(me.direction)) {
	if (me.direction.length == 5) {
	    var maxx, minx;
	    for (minx = me.x-1;stage[minx] && stage[minx][me.y][0] == STAGECOLOR;minx--);
	    for (maxx = me.x+1;stage[maxx] && stage[maxx][me.y][0] == STAGECOLOR;maxx--);
	    var width = Math.floor((maxx-minx)/2);
	    if (me.x-minx > width) {
		me.direction = "west";
	    } else {
		me.direction = "east";
	    }
	} else {
	    var maxy, miny;
	    for (miny = me.y-1;stage[me.x][miny] && stage[me.x][miny][0] == STAGECOLOR;miny--);
	    for (maxy = me.y+1;stage[me.x][maxy] && stage[me.x][maxy][0] == STAGECOLOR;maxy++);
	    var height = Math.floor((maxy - miny)/2);
	    if (me.y-miny > height) {
		me.direction = "north";
	    } else {
		me.direction = "south";
	    }
	}
    } else {
	yep(me.direction);
    }
    for (i=0;i<4 && nope(me.direction);i++)
	me.TurnLeft();
    return me;
}


function defaultAI0(stage, me, enemyPosition) {
	me.direction = "north";

	return me;
}