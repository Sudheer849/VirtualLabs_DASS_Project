let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let status = 0; //edge detection
//window.devicePixelRatio=1; //Blury Text
//ctx.fillRect(0, 0, canvas.width, canvas.height);
window.devicePixelRatio = 2; //Clear Text
//(CSS pixels).
//Display width
let width = 1200;
let height = 600;
canvas.style.width = width + "px";
canvas.style.height = height + "px";
// set background colour to black
let scale = window.devicePixelRatio;
canvas.width = Math.floor(width * scale);
canvas.height = Math.floor(height * scale);
ctx.fillRect(0, 0, canvas.width, canvas.height);
//CSS pixels for coordinate systems
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
let first_point = 5; // 1001 // TBRL  0101
let second_point = 10; // 0110 // 1010 0110
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
  ctx.fillStyle = "red";
  ctx.font = "16px serif";
  ctx.fillText(
    "(" + topleft_rect_x + "," + topleft_rect_y + ")",
    topleft_rect_x - 30,
    topleft_rect_y - 10
  );
  ctx.fillStyle = "red";
  ctx.font = "16px serif";
  ctx.fillText(
    "(" + topleft_rect_x + "," + bottomright_rect_y + ")",
    topleft_rect_x - 30,
    bottomright_rect_y - 10
  );
  ctx.fillStyle = "red";
  ctx.font = "16px serif";
  ctx.fillText(
    "(" + bottomright_rect_x + "," + topleft_rect_y + ")",
    bottomright_rect_x - 30,
    topleft_rect_y - 10
  );
  ctx.fillStyle = "red";
  ctx.font = "16px serif";
  ctx.fillText(
    "(" + bottomright_rect_x + "," + bottomright_rect_y + ")",
    bottomright_rect_x - 30,
    bottomright_rect_y - 10
  );
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  // make line thicker
  ctx.lineWidth = 2;
  ctx.strokeStyle = "yellow";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(topleft_rect_x, 0);
  ctx.lineTo(topleft_rect_x, height);
  // make line thicker
  ctx.lineWidth = 2;
  ctx.strokeStyle = "yellow";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bottomright_rect_x, 0);
  ctx.lineTo(bottomright_rect_x, height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "yellow";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  // make line thicker
  ctx.lineWidth = 2;
  ctx.strokeStyle = "yellow";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, topleft_rect_y);
  ctx.lineTo(width, topleft_rect_y);
  // make line thicker
  ctx.lineWidth = 2;
  ctx.strokeStyle = "yellow";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, bottomright_rect_y);
  ctx.lineTo(width, bottomright_rect_y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "yellow";
  ctx.stroke();
}
// take user input
function line(colour) {
  ctx.beginPath();
  ctx.moveTo(topleft_ln_x, topleft_ln_y);
  ctx.lineTo(bottomright_ln_x, bottomright_ln_y);
  // make line thicker
  ctx.lineWidth = 2;
  ctx.strokeStyle = colour;
  ctx.stroke();
}
function main() {
  grid();
  line("white");
}
function convertToBinary(x) {
  console.log(x);
  // current_point
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
function check() {
  console.log(current_point, top_side, current_point & top_side);
  if (
    (current_point == 0 && first_point_status == 1) ||
    findintersection() == 0
  ) {
    //console.log("inside");
    is_clipped = 1;
    text.innerHTML = "<br><br>Line is Clipped";
    logic_text.innerHTML = "";
    pointstat_text.innerHTML = "";
    ctx.beginPath();
    //ctx.setLineDash([5, 6]); //dashed line
    ctx.moveTo(topleft_rect_x, topleft_rect_y);
    ctx.lineTo(topleft_rect_x, bottomright_rect_y);
    // make line thicker
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bottomright_rect_x, topleft_rect_y);
    ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
    // make line thicker
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(topleft_rect_x, topleft_rect_y);
    ctx.lineTo(bottomright_rect_x, topleft_rect_y);
    // make line thicker
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(topleft_rect_x, bottomright_rect_y);
    ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
    // make line thicker
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(topleft_rect_x, topleft_rect_y);
    ctx.lineTo(bottomleft_rect_x, bottomright_rect_y);
    // make line thicker
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.stroke();
  }
  if (current_point == 0) {
    current_point = second_point;
    first_point_status = 1;
    transition_iteration = no_of_iterations;
  }

  console.log(status);
  if (current_point == 0 && second_point == 0) {
    alert("The line is clipped");
  }
  if (status == 0) {
    let eqornq = "==";
    if ((left_side & current_point) != 0) {
      eqornq = "!=";
    }
    text.innerHTML =
      "<br> <br> Left edge is selected for clipping the line aganist the left point";
    logic_text.innerHTML =
      "0" +
      "0" +
      "0" +
      "1" +
      " " +
      "&" +
      " " +
      convertToBinary(current_point) +
      " " +
      eqornq +
      " " +
      "0";
    if (first_point_status == 0) {
      pointstat_text.innerHTML = "First Point is Selected";
    } else {
      pointstat_text.innerHTML = "Second Point is Selected";
    }
    if (is_dark == 0) {
      // text.innerHTML =
      //"Clipping through left edge";
      console.log("dark");
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(topleft_rect_x, topleft_rect_y);
      ctx.lineTo(topleft_rect_x, bottomright_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "violet";
      ctx.stroke();
      is_dark = 1;
    } else {
      if ((left_side & current_point) != 0) {
        point("#606060", "#606060", "#606060");
        intersection();
        if (first_point_status == 0) {
          point("blue", "red", "red");
          // line("white");
          if_completed++;
        }
      }
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      console.log(topleft_rect_x, bottomright_rect_y);
      ctx.moveTo(topleft_rect_x, topleft_rect_y);
      ctx.lineTo(topleft_rect_x, bottomright_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      status = 1;
      is_dark = 0;
    }
  } else if (status == 1) {
    console.log(right_side);
    let eqornq = "==";
    if ((right_side & current_point) != 0) {
      eqornq = "!=";
    }
    text.innerHTML = "<br> <br> Right edge is selected for clipping";
    logic_text.innerHTML =
      "0" +
      "0" +
      "1" +
      "0" +
      " " +
      "&" +
      " " +
      convertToBinary(current_point) +
      " " +
      eqornq +
      " " +
      "0";
    if (first_point_status == 0) {
      pointstat_text.innerHTML = "First Point is Selected";
    } else {
      pointstat_text.innerHTML = "Second Point is Selected";
    }
    if (is_dark == 0) {
      console.log("dark");
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(bottomright_rect_x, topleft_rect_y);
      ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "violet";
      ctx.stroke();
      is_dark = 1;
    } else {
      if ((right_side & current_point) != 0) {
        if_completed++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(bottomright_rect_x, topleft_rect_y);
      ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      status = 2;
      is_dark = 0;
    }
  } else if (status == 2) {
    text.innerHTML = "<br> <br> Bottom edge is selected for clipping";
    let eqornq = "==";
    if ((bottom_side & current_point) != 0) {
      eqornq = "!=";
    }
    logic_text.innerHTML =
      "0" +
      "1" +
      "0" +
      "0" +
      " " +
      "&" +
      " " +
      convertToBinary(current_point) +
      " " +
      eqornq +
      " " +
      "0";
    if (first_point_status == 0) {
      pointstat_text.innerHTML = "First Point is Selected";
    } else {
      pointstat_text.innerHTML = "Second Point is Selected";
    }
    if (is_dark == 0) {
      console.log("dark");
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(topleft_rect_x, bottomright_rect_y);
      ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "violet";
      ctx.stroke();
      is_dark = 1;
    } else {
      console.log(bottom_side, current_point);
      if ((bottom_side & current_point) != 0) {
        if_completed++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(topleft_rect_x, bottomright_rect_y);
      ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      status = 3;
      is_dark = 0;
    }
  } else if (status == 3) {
    let eqornq = "==";
    console.log(current_point / 8);
    if ((top_side & current_point) != 0) {
      eqornq = "!=";
    }
    text.innerHTML = "<br> <br> Top edge is selected for clipping";
    logic_text.innerHTML =
      "1" +
      "0" +
      "0" +
      "0" +
      " " +
      "&" +
      " " +
      convertToBinary(current_point) +
      " " +
      eqornq +
      " " +
      "0";
    if (first_point_status == 0) {
      pointstat_text.innerHTML = "First Point is Selected";
    } else {
      pointstat_text.innerHTML = "Second Point is Selected";
    }
    console.log(top_side);
    console.log(current_point);
    if (is_dark == 0) {
      console.log("dark");
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(topleft_rect_x, topleft_rect_y);
      ctx.lineTo(bottomright_rect_x, topleft_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "violet";
      ctx.stroke();
      is_dark = 1;
    } else {
      if ((top_side & current_point) != 0) {
        if_completed++;
        console.log(top_side);
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(topleft_rect_x, topleft_rect_y);
      ctx.lineTo(bottomright_rect_x, topleft_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      status = 0;
      is_dark = 0;
    }
  }
}
function findintersection() {
  let slope =
    (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
  let y_intercept = topleft_ln_y - slope * topleft_ln_x;
  let variable = 0;
  if (
    slope * topleft_rect_x + y_intercept < topleft_rect_y ||
    slope * topleft_rect_x + y_intercept > bottomright_rect_y
  ) {
    variable = variable + 1;
  }
  if (
    slope * bottomright_rect_x + y_intercept < topleft_rect_y ||
    slope * bottomright_rect_x + y_intercept > bottomright_rect_y
  ) {
    variable = variable + 1;
  }
  if (
    (bottomright_rect_y - y_intercept) / slope < topleft_rect_x ||
    (bottomright_rect_y - y_intercept) / slope > bottomright_rect_x
  ) {
    variable = variable + 1;
  }
  if (
    (topleft_rect_y - y_intercept) / slope < topleft_rect_x ||
    (topleft_rect_y - y_intercept) / slope > bottomright_rect_x
  ) {
    variable = variable + 1;
  }
  if (variable == 4) {
    ctx.beginPath();
    ctx.moveTo(topleft_ln_x, topleft_ln_y);
    ctx.lineTo(bottomright_ln_x, bottomright_ln_y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    return 0;
  } else {
    return 1;
  }
}

function intersection() {
  // find the intersection of point with the line edges
  if (status == 0) {
    let slope =
      (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
    let y_intercept = topleft_ln_y - slope * topleft_ln_x;
    intersection_y = slope * topleft_rect_x + y_intercept;
    intersection_x = topleft_rect_x;
    // (intersection_x,intersection_y) represents the point of intersection
    ctx.beginPath();
    //ctx.setLineDash([5, 6]); //dashed line
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
    current_point = current_point & (15 - left_side); // 1001 & (1110) = (1000)
  } else if (status == 1) {
    let slope =
      (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
    let y_intercept = topleft_ln_y - slope * topleft_ln_x;
    intersection_y = slope * bottomright_rect_x + y_intercept;
    intersection_x = bottomright_rect_x;
    // (intersection_x,intersection_y) represents the point of intersection
    ctx.beginPath();
    // ctx.setLineDash([5, 6]); //dashed line
    //ctx.moveTo(topleft_ln_x, topleft_ln_y);
    if (first_point_status == 0) {
      ctx.moveTo(duptopleft_ln_x, duptopleft_ln_y);
    } else {
      ctx.moveTo(dupbottomright_ln_x, dupbottomright_ln_y);
    }
    ctx.lineTo(intersection_x, intersection_y);
    // make line thicker
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
  } else if (status == 2) {
    let slope =
      (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
    let y_intercept = topleft_ln_y - slope * topleft_ln_x;
    intersection_x = (bottomright_rect_y - y_intercept) / slope;
    intersection_y = bottomright_rect_y;
    // (intersection_x,intersection_y) represents the point of intersection
    ctx.beginPath();
    //  ctx.setLineDash([5, 6]); //dashed line
    //ctx.moveTo(topleft_ln_x, topleft_ln_y);
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
    current_point = current_point & (15 - bottom_side);
  } else if (status == 3) {
    let slope =
      (bottomright_ln_y - topleft_ln_y) / (bottomright_ln_x - topleft_ln_x);
    let y_intercept = topleft_ln_y - slope * topleft_ln_x;
    intersection_x = (topleft_rect_y - y_intercept) / slope;
    intersection_y = topleft_rect_y;
    // (intersection_x,intersection_y) represents the point of intersection
    ctx.beginPath();
    // ctx.setLineDash([5, 6]); //dashed line
    // ctx.moveTo(topleft_ln_x, topleft_ln_y);
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
    current_point = current_point & (15 - top_side); // 1111 - 1000 = 0111 & 1000 = 0000
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
  //no_of_iterations--;
  if (no_of_iterations == transition_iteration) {
    first_point_status = 0;
    current_point = 0;
  }
  if (is_dark == 1) {
    if (status == 0) {
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(topleft_rect_x, topleft_rect_y);
      ctx.lineTo(topleft_rect_x, bottomright_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      is_dark = 0;
    } else if (status == 1) {
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(bottomright_rect_x, bottomright_rect_y);
      ctx.lineTo(bottomright_rect_x, topleft_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      is_dark = 0;
    } else if (status == 2) {
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(topleft_rect_x, bottomright_rect_y);
      ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      is_dark = 0;
    } else if (status == 3) {
      ctx.beginPath();
      //ctx.setLineDash([5, 6]); //dashed line
      ctx.moveTo(topleft_rect_x, topleft_rect_y);
      ctx.lineTo(bottomright_rect_x, topleft_rect_y);
      // make line thicker
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.stroke();
      is_dark = 0;
    }
  } else {
    console.log(status);
    if (status == 0) {
      status = 3;
    } else {
      status = (status - 1) % 4;
    }
    // get the previous state
    console.log(first_point & left_side);
    if (status == 0) {
      if (
        (first_point_status == 0) & ((first_point & left_side) != 0) ||
        (first_point_status == 1) & ((second_point & left_side) != 0)
      ) {
        point("#606060", "#606060", "#606060");
        ctx.beginPath();
        // ctx.setLineDash([5, 6]); //dashed line
        // ctx.moveTo(topleft_ln_x, topleft_ln_y);
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
        //point("red","black");

        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.beginPath();
        //ctx.setLineDash([5, 6]); //dashed line
        ctx.moveTo(topleft_rect_x, topleft_rect_y);
        ctx.lineTo(topleft_rect_x, bottomright_rect_y);
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "violet";
        ctx.stroke();
        is_dark = 1;
        current_point = current_point + 1;
        point("blue", "red", "red");
      } else {
        ctx.beginPath();
        //ctx.setLineDash([5, 6]); //dashed line
        ctx.moveTo(topleft_rect_x, topleft_rect_y);
        ctx.lineTo(topleft_rect_x, bottomright_rect_y);
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "violet";
        ctx.stroke();
        is_dark = 1;
        // status = 3;
        // current_point = current_point & (15 - top_side);
      }
    } else if (status == 1) {
      console.log(status);
      console.log(
        first_point,
        right_side,
        first_point_status,
        first_point & right_side
      );
      if (
        (first_point_status == 0) & ((first_point & right_side) != 0) ||
        (first_point_status == 1) & ((second_point & right_side) != 0)
      ) {
        point("#606060", "#606060", "#606060");
        console.log("Hey I am here");
        ctx.beginPath();
        // ctx.setLineDash([5, 6]); //dashed line
        // ctx.moveTo(topleft_ln_x, topleft_ln_y);
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
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.beginPath();
        //ctx.setLineDash([5, 6]); //dashed line
        ctx.moveTo(bottomright_rect_x, topleft_rect_y);
        ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "violet";
        ctx.stroke();
        is_dark = 1;
        current_point = current_point + 2;
        point("blue", "red", "red");
      } else {
        ctx.beginPath();
        //ctx.setLineDash([5, 6]); //dashed line
        ctx.moveTo(bottomright_rect_x, topleft_rect_y);
        ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "violet";
        ctx.stroke();
        is_dark = 1;
        // status = 0;
        // current_point = current_point & (15 - left_side);
      }
    } else if (status == 2) {
      if (
        (first_point_status == 0) & ((first_point & bottom_side) != 0) ||
        (first_point_status == 1) & ((second_point & bottom_side) != 0)
      ) {
        point("#606060", "#606060", "#606060");
        console.log("Hello");
        ctx.beginPath();
        // ctx.setLineDash([5, 6]); //dashed line
        // ctx.moveTo(topleft_ln_x, topleft_ln_y);
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
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.beginPath();
        //ctx.setLineDash([5, 6]); //dashed line
        ctx.moveTo(topleft_rect_x, bottomright_rect_y);
        ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "violet";
        ctx.stroke();
        is_dark = 1;
        current_point = current_point + 4;
        point("blue", "red", "red");
      } else {
        console.log("bye");
        ctx.beginPath();
        //ctx.setLineDash([5, 6]); //dashed line
        ctx.moveTo(topleft_rect_x, bottomright_rect_y);
        ctx.lineTo(bottomright_rect_x, bottomright_rect_y);
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "violet";
        ctx.stroke();
        is_dark = 1;
        //  status = 1;
        //  current_point = current_point & (15 - right_side);
        console.log(current_point);
      }
    } else if (status == 3) {
      if (
        (first_point_status == 0) & ((first_point & top_side) != 0) ||
        (first_point_status == 1) & ((second_point & top_side) != 0)
      ) {
        point("#606060", "#606060", "#606060");
        console.log("Hello");
        ctx.beginPath();
        // ctx.setLineDash([5, 6]); //dashed line
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
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white"; //
        ctx.stroke();
        ctx.beginPath();
        //ctx.setLineDash([5, 6]); //dashed line
        ctx.moveTo(topleft_rect_x, topleft_rect_y);
        ctx.lineTo(bottomright_rect_x, topleft_rect_y);
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "violet";
        ctx.stroke();
        is_dark = 1;
        current_point = current_point + 8;
        point("blue", "red", "red");
      } else {
        ctx.beginPath();
        //ctx.setLineDash([5, 6]); //dashed line
        ctx.moveTo(topleft_rect_x, topleft_rect_y);
        ctx.lineTo(bottomright_rect_x, topleft_rect_y);
        // make line thicker
        ctx.lineWidth = 2;
        ctx.strokeStyle = "violet";
        ctx.stroke();
        is_dark = 1;
        //  status = 2;
        //  current_point = current_point & (15 - bottom_side);
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
    //TBRL
    first_point = 0;
    second_point = 0;
    // first_point = change_firstpoint();
    // second_point = change_secondpoint();
    // console.log(first_point);
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
    line("white");
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
  first_point = 5; // 1001 // TBRL  0101
  second_point = 10; // 0110 // 1010 0110
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
  line("white");
  //
});

//check();
//intersection();

//ctx.fillStyle = "yellow";
