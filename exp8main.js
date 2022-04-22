"use strict";
let canvas = document.getElementById("canvas");
var heightRatio = 1;
canvas.height = canvas.width * heightRatio;
resize(canvas);
let ctx = canvas.getContext("2d");
let status = 0;
window.devicePixelRatio = 2;
let width = 1200;
let height = 600;
canvas.style.width = width + "px";
canvas.style.height = height + "px";
let scale = window.devicePixelRatio;
canvas.width = Math.floor(width * scale);
canvas.height = Math.floor(height * scale);
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.scale(scale, scale);
ctx.font = "10px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
let x = width / 2;
let y = height / 2;
let topleft_rect_x = document.getElementById("cnt-top-left-x").value;
let topleft_rect_y = document.getElementById("cnt-top-left-y").value;
let bottomright_rect_x = document.getElementById("cnt-bottom-right-x").value;
let bottomright_rect_y = document.getElementById("cnt-bottom-right-y").value;
let topleft_ln_x = document.getElementById("ln-top-left-x").value;
let topleft_ln_y = document.getElementById("ln-top-left-y").value;
let bottomright_ln_x = document.getElementById("ln-bottom-right-x").value;
let bottomright_ln_y = document.getElementById("ln-bottom-right-y").value;
let next_button = document.getElementById("next_button");
let submit_button = document.getElementById("submit");
let previous_button = document.getElementById("prev_button");
let reset_button = document.getElementById("reset_button");
let text = document.getElementById("text");
let logic_text = document.getElementById("logic_text");
let pointstat_text = document.getElementById("pointstat_text");
let initialtopleft_ln_x = topleft_ln_x;
let initialtopleft_ln_y = topleft_ln_y;
let initialbottomright_ln_x = bottomright_ln_x;
let initialbottomright_ln_y = bottomright_ln_y;
let duptopleft_ln_x = topleft_ln_x;
let duptopleft_ln_y = topleft_ln_y;
let dupbottomright_ln_x = bottomright_ln_x;
let dupbottomright_ln_y = bottomright_ln_y;
let intersection_x, intersection_y;
let first_point = 5; // 1001
let second_point = 10; // 0110
let current_point = first_point;
let inside = 0; // 0000
let left_side = 1; // 0001
let right_side = 2; // 0010
let bottom_side = 4; // 0100
let top_side = 8; // 1000
let is_dark = 0;
let if_completed = 0;
let first_point_status = 0;
let is_clipped = 0;
let no_of_iterations = 0,
  transition_iteration = 0;
function convertToBinary(x) {

  let bin = "";
  for (let i = 3; i >= 0; i--) {
    if (x & (1 << i)) {
      bin = bin + "1";
    } else {
      bin = bin + "0";
    }
  }
  return bin;
}
function coordinates_text(x, y) {
  ctx.fillStyle = "red";
  ctx.font = "16px serif";
  ctx.fillText("(" + x + "," + y + ")", x - 30, y - 10);
}
function draw_line(x1, y1, x2, y2, width, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  // make line thicker
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}
function point(colour1, colour2, colour3) {
  ctx.beginPath();
  ctx.arc(topleft_ln_x, topleft_ln_y, 2, 0, 2 * Math.PI, false);
  ctx.lineWidth = 5;
  ctx.strokeStyle = colour1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bottomright_ln_x, bottomright_ln_y, 2, 0, 2 * Math.PI, false);
  ctx.lineWidth = 5;
  ctx.strokeStyle = colour2;
  ctx.stroke();
  ctx.fillStyle = colour3;
  ctx.font = "16px serif";
  ctx.fillText(
    "(" + parseInt(topleft_ln_x) + "," + parseInt(topleft_ln_y) + ")",
    parseInt(topleft_ln_x),
    parseInt(topleft_ln_y - 10)
  );
  ctx.fillStyle = colour3;
  ctx.font = "16px serif";
  ctx.fillText(
    "(" + parseInt(bottomright_ln_x) + "," + parseInt(bottomright_ln_y) + ")",
    parseInt(bottomright_ln_x),
    parseInt(bottomright_ln_y - 10)
  );
}
function grid() {
  document.getElementById("text").style.font = "20px serif";
  point("blue", "red", "red");
  coordinates_text(topleft_rect_x, topleft_rect_y);
  coordinates_text(bottomright_rect_x, bottomright_rect_y);
  coordinates_text(topleft_rect_x, bottomright_rect_y);
  coordinates_text(bottomright_rect_x, topleft_rect_y);
  draw_line(0, 0, 0, height, 2, "yellow");
  draw_line(topleft_rect_x, 0, topleft_rect_x, height, 2, "yellow");
  draw_line(bottomright_rect_x, 0, bottomright_rect_x, height, 2, "yellow");
  draw_line(0, 0, width, 0, 2, "yellow");
  draw_line(0, topleft_rect_y, width, topleft_rect_y, 2, "yellow");
  draw_line(0, bottomright_rect_y, width, bottomright_rect_y, 2, "yellow");
}
function main() {
  grid();
  draw_line(topleft_ln_x, topleft_ln_y, bottomright_ln_x, bottomright_ln_y, 2, "white");
}
function check() {
  if (
    (current_point == 0 && first_point_status == 1) || findintersection() == 0) {
    is_clipped = 1;
    text.innerHTML = "<br><br>Line is Clipped";
    logic_text.innerHTML = "";
    pointstat_text.innerHTML = "";
    draw_line(topleft_rect_x, topleft_rect_y, topleft_rect_x, bottomright_rect_y, 2, "green");
    draw_line(bottomright_rect_x, topleft_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "green");
    draw_line(topleft_rect_x, topleft_rect_y, bottomright_rect_x, topleft_rect_y, 2, "green");
    draw_line(topleft_rect_x, bottomright_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "green");
    draw_line(topleft_rect_x, topleft_rect_y, bottomleft_rect_x, bottomright_rect_y);
  }
  if (current_point == 0) {
    current_point = second_point;
    first_point_status = 1;
    transition_iteration = no_of_iterations;
  }
  if (status == 0) {
    let eqornq = "==";
    if ((left_side & current_point) != 0) {
      eqornq = "!=";
    }
    text.innerHTML =
      "<br> <br> Left edge is selected for clipping the line against the left point";
    logic_text.innerHTML = "0" + "0" + "0" + "1" + " " + "&" + " " + convertToBinary(current_point) + " " + eqornq + " " + "0";
    if (first_point_status == 0) {
      pointstat_text.innerHTML = "First Point is Selected";
    }
    else {
      pointstat_text.innerHTML = "Second Point is Selected";
    }
    if (is_dark == 0) {
      draw_line(topleft_rect_x, topleft_rect_y, topleft_rect_x, bottomright_rect_y, 2, "violet");
      is_dark = 1;
    }
    else {
      if ((left_side & current_point) != 0) {
        point("#606060", "#606060", "#606060");
        intersection();
        if (first_point_status == 0) {
          point("blue", "red", "red");
          if_completed++;
        }
      }
      draw_line(topleft_rect_x, topleft_rect_y, topleft_rect_x, bottomright_rect_y, 2, "yellow");
      status = 1;
      is_dark = 0;
    }
  }
  else if (status == 1) {
    let eqornq = "==";
    if ((right_side & current_point) != 0) {
      eqornq = "!=";
    }
    text.innerHTML = "<br> <br> Right edge is selected for clipping";
    logic_text.innerHTML = "0" + "0" + "1" + "0" + " " + "&" + " " + convertToBinary(current_point) + " " + eqornq + " " + "0";
    if (first_point_status == 0) {
      pointstat_text.innerHTML = "First Point is Selected";
    } else {
      pointstat_text.innerHTML = "Second Point is Selected";
    }
    if (is_dark == 0) {
      draw_line(bottomright_rect_x, topleft_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "violet");
      is_dark = 1;
    }
    else {
      if ((right_side & current_point) != 0) {
        if_completed++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      draw_line(bottomright_rect_x, topleft_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "yellow");
      status = 2;
      is_dark = 0;
    }
  }
  else if (status == 2) {
    let eqornq = "==";
    if ((bottom_side & current_point) != 0) {
      eqornq = "!=";
    }
    logic_text.innerHTML = "0" + "1" + "0" + "0" + " " + "&" + " " + convertToBinary(current_point) + " " + eqornq + " " + "0";
    if (first_point_status == 0) {
      pointstat_text.innerHTML = "First Point is Selected";
    } else {
      pointstat_text.innerHTML = "Second Point is Selected";
    }
    if (is_dark == 0) {
      draw_line(topleft_rect_x, bottomright_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "violet");
      is_dark = 1;
    }
    else {
      if ((bottom_side & current_point) != 0) {
        if_completed++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      draw_line(topleft_rect_x, bottomright_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "yellow");
      status = 3;
      is_dark = 0;
    }
  }
  else if (status == 3) {
    let eqornq = "==";
    console.log(current_point / 8);
    if ((top_side & current_point) != 0) {
      eqornq = "!=";
    }
    text.innerHTML = "<br> <br> Top edge is selected for clipping";
    logic_text.innerHTML = "1" + "0" + "0" + "0" + " " + "&" + " " + convertToBinary(current_point) + " " + eqornq + " " + "0";
    if (first_point_status == 0) {
      pointstat_text.innerHTML = "First Point is Selected";
    } else {
      pointstat_text.innerHTML = "Second Point is Selected";
    }
    if (is_dark == 0) {
      draw_line(topleft_rect_x, topleft_rect_y, bottomright_rect_x, topleft_rect_y, 2, "violet");
      is_dark = 1;
    } else {
      if ((top_side & current_point) != 0) {
        if_completed++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      draw_line(topleft_rect_x, topleft_rect_y, bottomright_rect_x, topleft_rect_y, 2, "yellow");
      status = 0;
      is_dark = 0;
    }
  }
}
function findintersection() {
  if (((topleft_ln_x - topleft_rect_x <= 0) && (bottomright_ln_x - topleft_rect_x <= 0)) || ((topleft_ln_x - bottomright_rect_x >= 0) && (bottomright_ln_x - bottomleft_rect_x >= 0)) || ((topleft_ln_y - topleft_rect_y <= 0) && (bottomright_ln_y - topleft_rect_y <= 0)) || ((topleft_ln_y - bottomright_rect_y >= 0) && (bottomright_ln_y - bottomright_rect_y >= 0))) {
    draw_line(topleft_ln_x, topleft_ln_y, bottomright_ln_x, bottomright_ln_y, 2, "#606060");
    return 0;
  }
  let slope =
    (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
  let y_intercept = topleft_ln_y - slope * topleft_ln_x;
  let variable = 0;
  if (slope * topleft_rect_x + y_intercept < topleft_rect_y || slope * topleft_rect_x + y_intercept > bottomright_rect_y) {
    variable = variable + 1;
  }
  if (slope * bottomright_rect_x + y_intercept < topleft_rect_y || slope * bottomright_rect_x + y_intercept > bottomright_rect_y) {
    variable = variable + 1;
  }
  if ((bottomright_rect_y - y_intercept) / slope < topleft_rect_x || (bottomright_rect_y - y_intercept) / slope > bottomright_rect_x) {
    variable = variable + 1;
  }
  if ((topleft_rect_y - y_intercept) / slope < topleft_rect_x || (topleft_rect_y - y_intercept) / slope > bottomright_rect_x) {
    variable = variable + 1;
  }
  if (variable == 4) {
    draw_line(topleft_ln_x, topleft_ln_y, bottomright_ln_x, bottomright_ln_y, 2, "#606060");
    return 0;
  }
  else {
    return 1;
  }
}
function intersection() {
  // find the intersection of point with the line edges
  if (status == 0) {
    let slope = (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
    let y_intercept = topleft_ln_y - slope * topleft_ln_x;
    intersection_y = slope * topleft_rect_x + y_intercept;
    intersection_x = topleft_rect_x;
    ctx.beginPath();
    if (first_point_status == 0) {
      ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
    } else {
      ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (first_point_status == 0) {
      duptopleft_ln_x = topleft_ln_x;
      duptopleft_ln_y = topleft_ln_y;
      topleft_ln_x = intersection_x;
      topleft_ln_y = intersection_y;
    } else {
      dupbottomright_ln_x = bottomright_ln_x;
      dupbottomright_ln_y = bottomright_ln_y;
      bottomright_ln_x = intersection_x;
      bottomright_ln_y = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    current_point = current_point & (15 - left_side);
  }
  else if (status == 1) {
    let slope = (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
    let y_intercept = topleft_ln_y - slope * topleft_ln_x;
    intersection_y = slope * bottomright_rect_x + y_intercept;
    intersection_x = bottomright_rect_x;
    ctx.beginPath();
    if (first_point_status == 0) {
      ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
    } else {
      ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (first_point_status == 0) {
      duptopleft_ln_x = topleft_ln_x;
      duptopleft_ln_y = topleft_ln_y;
      topleft_ln_x = intersection_x;
      topleft_ln_y = intersection_y;
    } else {
      dupbottomright_ln_x = bottomright_ln_x;
      dupbottomright_ln_y = bottomright_ln_y;
      bottomright_ln_x = intersection_x;
      bottomright_ln_y = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    current_point = current_point & (15 - right_side);
  }
  else if (status == 2) {
    let slope = (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
    let y_intercept = topleft_ln_y - slope * topleft_ln_x;
    intersection_x = (bottomright_rect_y - y_intercept) / slope;
    intersection_y = bottomright_rect_y;
    ctx.beginPath();
    if (first_point_status == 0) {
      ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
    } else {
      ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (first_point_status == 0) {
      duptopleft_ln_x = topleft_ln_x;
      duptopleft_ln_y = topleft_ln_y;
      topleft_ln_x = intersection_x;
      topleft_ln_y = intersection_y;
    } else {
      dupbottomright_ln_x = bottomright_ln_x;
      dupbottomright_ln_y = bottomright_ln_y;
      bottomright_ln_x = intersection_x;
      bottomright_ln_y = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    current_point = current_point & (15 - bottom_side);
  }
  else if (status == 3) {
    let slope = (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
    let y_intercept = topleft_ln_y - slope * topleft_ln_x;
    intersection_x = (topleft_rect_y - y_intercept) / slope;
    intersection_y = topleft_rect_y;
    ctx.beginPath();
    if (first_point_status == 0) {
      ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
    } else {
      ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (first_point_status == 0) {
      duptopleft_ln_x = topleft_ln_x;
      duptopleft_ln_y = topleft_ln_y;
      topleft_ln_x = intersection_x;
      topleft_ln_y = intersection_y;
    } else {
      dupbottomright_ln_x = bottomright_ln_x;
      dupbottomright_ln_y = bottomright_ln_y;
      bottomright_ln_x = intersection_x;
      bottomright_ln_y = intersection_y;
    }
    // make line thicker
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    console.log(current_point);
    current_point = current_point & (15 - top_side);
    console.log("Hello");
    console.log(current_point);
  }
}

main();

next_button.addEventListener("click", () => {
  no_of_iterations++;
  check();
});
previous_button.addEventListener("click", () => {
  if (no_of_iterations == 0 || is_clipped == 1) {
    return;
  }
  if (no_of_iterations == transition_iteration) {
    first_point_status = 0;
    current_point = 0;
  }
  if (is_dark == 1) {
    if (status == 0) {
      draw_line(topleft_rect_x, topleft_rect_y, topleft_rect_x, bottomright_rect_y, 2, "yellow");
      is_dark = 0;
    } else if (status == 1) {
      draw_line(bottomright_rect_x, bottomright_rect_y, bottomright_rect_x, topleft_rect_y, 2, "yellow");
      is_dark = 0;
    } else if (status == 2) {
      draw_line(topleft_rect_x, bottomright_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "yellow");
      is_dark = 0;
    } else if (status == 3) {
      draw_line(topleft_rect_x, topleft_rect_y, bottomright_rect_x, topleft_rect_y, 2, "yellow");
      is_dark = 0;
    }
  }
  else {
    if (status == 0) {
      status = 3;
    } else {
      status = (status - 1) % 4;
    }
    if (status == 0) {
      if ((first_point_status == 0) & ((first_point & left_side) != 0) || (first_point_status == 1) & ((second_point & left_side) != 0)) {
        point("#606060", "#606060", "#606060");
        ctx.beginPath();
        if (first_point_status == 0) {
          ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
          topleft_ln_x = duptopleft_ln_x;
          topleft_ln_y = duptopleft_ln_y;
          if (duptopleft_ln_x == topleft_ln_x && duptopleft_ln_y == topleft_ln_y && topleft_ln_x != initialtopleft_ln_x & topleft_ln_y != initialtopleft_ln_y) {
            duptopleft_ln_x = initialtopleft_ln_x;
            duptopleft_ln_y = initialtopleft_ln_y;
          }
        } else {
          ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
          bottomright_ln_x = dupbottomright_ln_x;
          bottomright_ln_y = dupbottomright_ln_y;
          if (dupbottomright_ln_x == bottomright_ln_x && dupbottomright_ln_y == bottomright_ln_y && bottomright_ln_x != initialbottomright_ln_x & bottomright_ln_y != initialbottomright_ln_y) {
            dupbottomright_ln_x = initialbottomright_ln_x;
            dupbottomright_ln_y = initialbottomright_ln_y;
          }
        }
        ctx.lineTo(intersection_x, intersection_y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        draw_line(topleft_rect_x, topleft_rect_y, topleft_rect_x, bottomright_rect_y, 2, "violet");
        is_dark = 1;
        current_point = current_point + 1;
        point("blue", "red", "red");
      } else {
        draw_line(topleft_rect_x, topleft_rect_y, topleft_rect_x, bottomright_rect_y, 2, "violet");
        is_dark = 1;
      }
    } else if (status == 1) {
      if ((first_point_status == 0) & ((first_point & right_side) != 0) || (first_point_status == 1) & ((second_point & right_side) != 0)) {
        point("#606060", "#606060", "#606060");
        ctx.beginPath();
        if (first_point_status == 0) {
          ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
          topleft_ln_x = duptopleft_ln_x;
          topleft_ln_y = duptopleft_ln_y;
          if (duptopleft_ln_x == topleft_ln_x && duptopleft_ln_y == topleft_ln_y && topleft_ln_x != initialtopleft_ln_x && topleft_ln_y != initialtopleft_ln_y) {
            duptopleft_ln_x = initialtopleft_ln_x;
            duptopleft_ln_y = initialtopleft_ln_y;
          }
        } else {
          ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
          bottomright_ln_x = dupbottomright_ln_x;
          bottomright_ln_y = dupbottomright_ln_y;
          if (dupbottomright_ln_x == bottomright_ln_x && dupbottomright_ln_y == bottomright_ln_y && bottomright_ln_x != initialbottomright_ln_x && bottomright_ln_y != initialbottomright_ln_y) {
            dupbottomright_ln_x = initialbottomright_ln_x;
            dupbottomright_ln_y = initialbottomright_ln_y;
          }
        }
        ctx.lineTo(intersection_x, intersection_y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        draw_line(bottomright_rect_x, topleft_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "violet");
        is_dark = 1;
        current_point = current_point + 2;
        point("blue", "red", "red");
      } else {
        draw_line(bottomright_rect_x, topleft_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "violet");
        is_dark = 1;
      }
    } else if (status == 2) {
      if ((first_point_status == 0) & ((first_point & bottom_side) != 0) || (first_point_status == 1) & ((second_point & bottom_side) != 0)) {
        point("#606060", "#606060", "#606060");
        ctx.beginPath();
        if (first_point_status == 0) {
          ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
          topleft_ln_x = duptopleft_ln_x;
          topleft_ln_y = duptopleft_ln_y;
          if (
            duptopleft_ln_x == topleft_ln_x &&
            duptopleft_ln_y == topleft_ln_y &&
            topleft_ln_x != initialtopleft_ln_x &&
            topleft_ln_y != initialtopleft_ln_y
          ) {
            duptopleft_ln_x = initialtopleft_ln_x;
            duptopleft_ln_y = initialtopleft_ln_y;
          }
        } else {
          ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
          bottomright_ln_x = dupbottomright_ln_x;
          bottomright_ln_y = dupbottomright_ln_y;
          if (
            dupbottomright_ln_x == bottomright_ln_x &&
            dupbottomright_ln_y == bottomright_ln_y &&
            bottomright_ln_x != initialbottomright_ln_x &&
            bottomright_ln_y != initialbottomright_ln_y
          ) {
            dupbottomright_ln_x = initialbottomright_ln_x;
            dupbottomright_ln_y = initialbottomright_ln_y;
          }
        }
        ctx.lineTo(intersection_x, intersection_y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        draw_line(topleft_rect_x, bottomright_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "violet");
        is_dark = 1;
        current_point = current_point + 4;
        point("blue", "red", "red");
      } else {
        draw_line(topleft_rect_x, bottomright_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "violet");
        is_dark = 1;
      }
    } else if (status == 3) {
      if ((first_point_status == 0) & ((first_point & top_side) != 0) || (first_point_status == 1) & ((second_point & top_side) != 0)
      ) {
        point("#606060", "#606060", "#606060");
        console.log("Hello");
        ctx.beginPath();
        if (first_point_status == 0) {
          ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
          topleft_ln_x = duptopleft_ln_x;
          topleft_ln_y = duptopleft_ln_y;
          if (duptopleft_ln_x == topleft_ln_x && duptopleft_ln_y == topleft_ln_y && topleft_ln_x != initialtopleft_ln_x && topleft_ln_y != initialtopleft_ln_y) {
            duptopleft_ln_x = initialtopleft_ln_x;
            duptopleft_ln_y = initialtopleft_ln_y;
          }
        }
        else {
          ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
          bottomright_ln_x = dupbottomright_ln_x;
          bottomright_ln_y = dupbottomright_ln_y;
          if (
            dupbottomright_ln_x == bottomright_ln_x &&
            dupbottomright_ln_y == bottomright_ln_y &&
            bottomright_ln_x != initialbottomright_ln_x &&
            bottomright_ln_y != initialbottomright_ln_y
          ) {
            dupbottomright_ln_x = initialbottomright_ln_x;
            dupbottomright_ln_y = initialbottomright_ln_y;
          }
        }
        ctx.lineTo(intersection_x, intersection_y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white"; //
        ctx.stroke();
        draw_line(topleft_rect_x, topleft_rect_y, bottomright_rect_x, topleft_rect_y, 2, "violet");
        is_dark = 1;
        current_point = current_point + 8;
        point("blue", "red", "red");
      } else {
        draw_line(topleft_rect_x, topleft_rect_y, bottomright_rect_x, topleft_rect_y, 2, "violet");
      }
    }
  }
  no_of_iterations--;
});
submit_button.addEventListener("click", () => {
  if (no_of_iterations == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    topleft_rect_x = document.getElementById("cnt-top-left-x").value;
    topleft_rect_y = document.getElementById("cnt-top-left-y").value;
    bottomright_rect_x = document.getElementById("cnt-bottom-right-x").value;
    bottomright_rect_y = document.getElementById("cnt-bottom-right-y").value;
    topleft_ln_x = document.getElementById("ln-top-left-x").value;
    topleft_ln_y = document.getElementById("ln-top-left-y").value;
    bottomright_ln_x = document.getElementById("ln-bottom-right-x").value;
    bottomright_ln_y = document.getElementById("ln-bottom-right-y").value;
    initialtopleft_ln_x = topleft_ln_x;
    initialtopleft_ln_y = topleft_ln_y;
    initialbottomright_ln_x = bottomright_ln_x;
    initialbottomright_ln_y = bottomright_ln_y;
    duptopleft_ln_x = topleft_ln_x;
    duptopleft_ln_y = topleft_ln_y;
    dupbottomright_ln_x = bottomright_ln_x;
    dupbottomright_ln_y = bottomright_ln_y;
    first_point = 0;
    second_point = 0;
    if (topleft_ln_x - topleft_rect_x < 0) {
      first_point = first_point + Math.pow(2, 0);
    }
    if (topleft_ln_x - bottomright_rect_x > 0) {
      first_point = first_point + Math.pow(2, 1);
    }
    if (topleft_ln_y - bottomright_rect_y > 0) {
      first_point = first_point + Math.pow(2, 2);
    }
    if (topleft_ln_y - topleft_rect_y < 0) {
      first_point = first_point + Math.pow(2, 3);
    }

    if (bottomright_ln_x - topleft_rect_x < 0) {
      second_point = second_point + Math.pow(2, 0);
    }
    if (bottomright_ln_x - bottomright_rect_x > 0) {
      second_point = second_point + Math.pow(2, 1);
    }
    if (bottomright_ln_y - bottomright_rect_y > 0) {
      second_point = second_point + Math.pow(2, 2);
    }
    if (bottomright_ln_y - topleft_rect_y < 0) {
      second_point = second_point + Math.pow(2, 3);
    }

    if (first_point_status == 0) {
      current_point = first_point;
    } else {
      current_point = second_point;
    }
    console.log(first_point);
    console.log(second_point);

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    grid();
    draw_line(topleft_ln_x, topleft_ln_y, bottomright_ln_x, bottomright_ln_y, 2, "white");
  }
});

reset_button.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  topleft_ln_x = initialtopleft_ln_x;
  topleft_ln_y = initialtopleft_ln_y;
  bottomright_ln_x = initialbottomright_ln_x;
  bottomright_ln_y = initialbottomright_ln_y;
  duptopleft_ln_x = topleft_ln_x;
  duptopleft_ln_y = topleft_ln_y;
  dupbottomright_ln_x = bottomright_ln_x;
  dupbottomright_ln_y = bottomright_ln_y;
  current_point = first_point;
  inside = 0; // 0000
  is_dark = 0;
  if_completed = 0;
  first_point_status = 0;
  no_of_iterations = 0;
  status = 0;
  ctx.fillStyle = "black";
  ctx.fill();
  grid();
  draw_line(topleft_ln_x, topleft_ln_y, bottomright_ln_x, bottomright_ln_y, 2, "white");
  text.innerHTML = "";
  logic_text.innerHTML = "";
  pointstat_text.innerHTML = "";
  is_clipped = 0;
  //
});
function resize(canvas) {
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = 2 * displayWidth;
    canvas.height = displayHeight;
  }
}