/* Hello World example, stolen from the web editor.*/

function setup() {
  createCanvas(800, 800);
  noLoop();
  noStroke();
}

let reward = 0;

let x = 50;
let y = 500;
let r = 40;

let gold_r = 10;

let gold = [[200, 200], [220, 200], [250, 250], [450, 30]];


/* first 2 are TOP CORNER coordinates, second 2 are width and height */

let wall = [[650, 300, 50, 450], [300, 650, 400, 50]];

function draw() {
  let agent_color = color(0, 255, 100);
  let gold_color = color(255, 200, 0);
  let wall_color = color(0, 0, 0);

  background(220);
  fill(gold_color);
  gold.forEach(function(item, index, array) {
    ellipse(item[0], item[1], 2*gold_r, 2*gold_r);
  })
  fill(wall_color);
  wall.forEach(function(item, index, array) {
    rect(item[0], item[1], item[2], item[3]);
  })
  fill(agent_color);
  ellipse(x, y, 2*r, 2*r);
}

function spot_overlap_check(agent_x, agent_y, spot_x, spot_y, spot_r){
  const pointing = createVector(agent_x - spot_x, agent_y - spot_y);
  let overlap = pointing.mag() - r - spot_r;
  if (overlap < 0){
    return true;
  } else {
    return false;
  }
}

function wall_overlap_check(agent_x, agent_y, wall_x, wall_y, wall_w, wall_h){
  let left_lim = wall_x;
  let right_lim = wall_x + wall_w;
  let top_lim = wall_y;
  let bot_lim = wall_y + wall_h;
  if ((agent_y >= top_lim) && (agent_y <= bot_lim) && (agent_x >= left_lim) && (agent_x <= right_lim)) { /* Exotic case, agent inside wall */
    return true;
  } else if ((agent_y >= top_lim) && (agent_y <= bot_lim) && (agent_x <= left_lim) && (agent_x + r > left_lim)) { /* Hitting from the left*/
    return true;
  } else if ((agent_y >= top_lim) && (agent_y <= bot_lim) && (agent_x >= right_lim) && (agent_x - r < right_lim)) { /* Hitting from the right */
    return true;
  } else if ((agent_x >= left_lim) && (agent_x <= right_lim) && (agent_y <= top_lim) && (agent_y + r > top_lim)) { /* Hitting from the top */
    return true;
  } else if ((agent_x >= left_lim) && (agent_x <= right_lim) && (agent_y >= bot_lim) && (agent_y - r < bot_lim)) { /* Hitting from the bottom */
    return true;
  } else if (spot_overlap_check(agent_x, agent_y, left_lim, top_lim, 0)) { /* 4 corner checks */
    return true;
  } else if (spot_overlap_check(agent_x, agent_y, right_lim, top_lim, 0)) {
    return true;
  } else if (spot_overlap_check(agent_x, agent_y, left_lim, bot_lim, 0)) {
    return true;
  } else if (spot_overlap_check(agent_x, agent_y, right_lim, bot_lim, 0)) {
    return true;
  } else {
    return false;
  }
}

function gold_update() {
  for (var i = gold.length -1; i >= 0; i--) {
    if (spot_overlap_check(x, y, gold[i][0], gold[i][1], gold_r)){
      gold.splice(i, 1);
      reward += 1;
      console.log(reward);
    }
  }
}

function full_wall_check(agent_x, agent_y) {
  return !wall.some(item => wall_overlap_check(agent_x, agent_y, item[0], item[1], item[2], item[3])); /* Returns true if in the clear. */
}

function biggest_step(lim, coords_from_i) {
  for (var i = lim; i >= 0; i--) {
    cc = coords_from_i(i);
    if (full_wall_check(cc[0], cc[1])){
      return i;
    }
  }
  return 0;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    let i = biggest_step(10, (i => [x - i, y]));
    x -= i;
  } else if (keyCode === RIGHT_ARROW) {
    let i = biggest_step(10, (i => [x + i, y]));
    x += i;
  } else if (keyCode === UP_ARROW) {
    let i = biggest_step(10, (i => [x, y - i]));
    y -= i;
  } else if (keyCode === DOWN_ARROW) {
    let i = biggest_step(10, (i => [x, y + i]));
    y += i;
  } else {
    return false;
  }
  gold_update();
  draw();
  return false;
}

function mousePressed(){
  console.log([mouseX, mouseY]);
  return false;
}

