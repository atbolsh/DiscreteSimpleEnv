/* DEFAULTS */

/* This makes it so levels don't need to declare empty vars for features they don't need (eg "wall" or "gold").
Also makes backwards compatibility smoother if new features are added. */

let reward = 0;

let x = 400;
let y = 400;
let r = 40;
let indicator_length = 400;

let angular_velocity = 0;
let direction = 0; /* direction it is pointing. Radians clockwise from 3 o-clock. */
let velocity = 0; /* current velocity. */

let gold_r = 10;

let gold = [];

let wall = [];


function setup() {
  createCanvas(800, 800);
  noStroke();
}

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
    rotate(item[4]); /* Next, correct collisions. */
    let newTopLeft = backRot(item[0], item[1], item[4]); 
    rect(newTopLeft[0], newTopLeft[1], item[2], item[3]);
    rotate(-item[4]);
  })
  update_position();
  fill(agent_color);
  ellipse(x, y, 2*r, 2*r);
  stroke(0);
  line(x, y, x + Math.cos(direction)*indicator_length, y + Math.sin(direction)*indicator_length);
  noStroke();
}

function update_position(){
  candidate_x = x + Math.cos(direction)*velocity;
  candidate_y = y + Math.sin(direction)*velocity; /* never more than 1 pixel away. */
  if (full_wall_check(candidate_x, candidate_y)) {
    x = candidate_x;
    y = candidate_y;
  } else { 
    stop();
  }
  direction += angular_velocity;
  gold_update()
}

function accelerate(){ /* Max at 1 makes learning easier, and makes update steps less involved. */
  velocity = Math.min(velocity + 0.1, 1);
}

function stop(){
  velocity = 0;
  angular_velocity = 0;
}

function swivel_clock(){
  angular_velocity = 0.01;
}

function swivel_anticlock(){
  angular_velocity = -0.01;
}

function backRot(pos_x, pos_y, angle){ /* counterclockwise, compensating */
  let c = Math.cos(angle);
  let s = Math.sin(angle);
  return [c*pos_x + s*pos_y, 0 - s*pos_x + c*pos_y];
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

function wall_overlap_check(old_agent_x, old_agent_y, wall_x, wall_y, wall_w, wall_h, wall_theta){
  let agent_pos = backRot(old_agent_x, old_agent_y, wall_theta);
  let agent_x = agent_pos[0]; /* Too lazy to change old code; one too many vars will be used. Still fast, can be fixed fast, especially if I use vectors.*/
  let agent_y = agent_pos[1];
  let wall_lim = backRot(wall_x, wall_y, wall_theta);
  let left_lim = wall_lim[0];
  let right_lim = left_lim + wall_w;
  let top_lim = wall_lim[1];
  let bot_lim = top_lim + wall_h;
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
  return !wall.some(item => wall_overlap_check(agent_x, agent_y, item[0], item[1], item[2], item[3], item[4])); /* Returns true if in the clear. */
}


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    swivel_anticlock();
  } else if (keyCode === RIGHT_ARROW) {
    swivel_clock();
  } else if (keyCode === UP_ARROW) {
    accelerate();
  } else if (keyCode === 32) { /* Space */
    stop();
  } else {
    return false;
  }
  return false;
}

function mousePressed(){
  console.log([mouseX, mouseY]);
  return false;
}



