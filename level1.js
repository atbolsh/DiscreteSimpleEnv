let reward = 0;

let x = 700;
let y = 700;
let r = 40;

let gold_r = 10;

let gold = [];

/* first 2 are TOP CORNER coordinates, second 2 are width and height, then rotation clockwise (negative for counterclockwise).
Rotation is around top left corner.  */
let wall = [[100, 100, 50, 450, 0], [100, 100, 50, 450, - Math.PI/6]]; /* Here is the change; make it work with backend, now. */


