"use strict";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let status = 0;
window.devicePixelRatio = 2;
let width = 1200;
let height = 600;
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
let topLeftRectX = document.getElementById("cnt-top-left-x").value;
let topLeftRectY = document.getElementById("cnt-top-left-y").value;
let bottomRightRectX = document.getElementById("cnt-bottom-right-x").value;
let bottomRightRectY = document.getElementById("cnt-bottom-right-y").value;
let topLeftLnX = document.getElementById("ln-top-left-x").value;
let topLeftLnY = document.getElementById("ln-top-left-y").value;
let bottomRightLnX = document.getElementById("ln-bottom-right-x").value;
let bottomRightLnY = document.getElementById("ln-bottom-right-y").value;
let nextButton = document.getElementById("next_button");
let submitButton = document.getElementById("submit");
let previousButton = document.getElementById("prev_button");
let resetButton = document.getElementById("reset_button");
let text = document.getElementById("text");
let logicText = document.getElementById("logic_text");
let pointStatText = document.getElementById("pointstat_text");
let initialtopLeftLnX = topLeftLnX;
let initialtopLeftLnY = topLeftLnY;
let initialbottomRightLnX = bottomRightLnX;
let initialbottomRightLnY = bottomRightLnY;
let duptopLeftLnX = topLeftLnX;
let duptopLeftLnY = topLeftLnY;
let dupbottomRightLnX = bottomRightLnX;
let dupbottomRightLnY = bottomRightLnY;
let intersection_x, intersection_y;
let firstPoint = 5;
let secondPoint = 10;
let currentPoint = firstPoint;
let inside = 0;
let leftSide = 1;
let rightSide = 2;
let bottomSide = 4;
let topSide = 8;
let isDark = 0;
let ifCompleted = 0;
let firstpointStatus = 0;
let isClipped = 0;
let noofIterations = 0,
  transitionIteration = 0;
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
  x1 = parseFloat(x1) + 0.5;
  y1 = parseFloat(y1) + 0.5;
  x2 = parseFloat(x2) + 0.5;
  y2 = parseFloat(y2) + 0.5;

  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}
function point(colour1, colour2, colour3) {
  ctx.beginPath();
  ctx.arc(topLeftLnX, topLeftLnY, 2, 0, 2 * Math.PI, false);
  ctx.lineWidth = 5;
  ctx.strokeStyle = colour1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bottomRightLnX, bottomRightLnY, 2, 0, 2 * Math.PI, false);
  ctx.lineWidth = 5;
  ctx.strokeStyle = colour2;
  ctx.stroke();
  ctx.fillStyle = colour3;
  ctx.font = "16px serif";
  ctx.fillText(
    "(" + parseInt(topLeftLnX) + "," + parseInt(topLeftLnY) + ")",
    parseInt(topLeftLnX),
    parseInt(topLeftLnY - 10)
  );
  ctx.fillStyle = colour3;
  ctx.font = "16px serif";
  ctx.fillText(
    "(" + parseInt(bottomRightLnX) + "," + parseInt(bottomRightLnY) + ")",
    parseInt(bottomRightLnX),
    parseInt(bottomRightLnY - 10)
  );
}
function grid() {
  document.getElementById("text").style.font = "20px serif";
  point("blue", "red", "red");
  coordinates_text(topLeftRectX, topLeftRectY);
  coordinates_text(bottomRightRectX, bottomRightRectY);
  coordinates_text(topLeftRectX, bottomRightRectY);
  coordinates_text(bottomRightRectX, topLeftRectY);
  draw_line(0, 0, 0, height, 2, "yellow");
  draw_line(topLeftRectX, 0, topLeftRectX, height, 2, "yellow");
  draw_line(bottomRightRectX, 0, bottomRightRectX, height, 2, "yellow");
  draw_line(0, 0, width, 0, 2, "yellow");
  draw_line(0, topLeftRectY, width, topLeftRectY, 2, "yellow");
  draw_line(0, bottomRightRectY, width, bottomRightRectY, 2, "yellow");
}
function main() {
  grid();
  draw_line(topLeftLnX, topLeftLnY, bottomRightLnX, bottomRightLnY, 2, "white");
}
function check() {
  if (
    (currentPoint == 0 && firstpointStatus == 1) || findintersection() == 0) {
    isClipped = 1;
    text.innerHTML = "<br><br>Line is Clipped";
    logicText.innerHTML = "";
    pointStatText.innerHTML = "";
    draw_line(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "green");
    draw_line(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "green");
    draw_line(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "green");
    draw_line(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "green");
    draw_line(topLeftRectX, topLeftRectY, bottomleft_rect_x, bottomRightRectY);
  }
  if (currentPoint == 0) {
    currentPoint = secondPoint;
    firstpointStatus = 1;
    transitionIteration = noofIterations;
  }
  if (status == 0) {
    let eqornq = "==";
    if ((leftSide & currentPoint) != 0) {
      eqornq = "!=";
    }
    text.innerHTML =
      "<br> <br> Left edge is selected for clipping the line against the left point";
    logicText.innerHTML = "0" + "0" + "0" + "1" + " " + "&" + " " + convertToBinary(currentPoint) + " " + eqornq + " " + "0";
    if (firstpointStatus == 0) {
      pointStatText.innerHTML = "First Point is Selected";
    }
    else {
      pointStatText.innerHTML = "Second Point is Selected";
    }
    if (isDark == 0) {
      draw_line(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "violet");
      isDark = 1;
    }
    else {
      if ((leftSide & currentPoint) != 0) {
        point("#606060", "#606060", "#606060");
        intersection();
        if (firstpointStatus == 0) {
          point("blue", "red", "red");
          ifCompleted++;
        }
      }
      draw_line(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "yellow");
      status = 1;
      isDark = 0;
    }
  }
  else if (status == 1) {
    let eqornq = "==";
    if ((rightSide & currentPoint) != 0) {
      eqornq = "!=";
    }
    text.innerHTML = "<br> <br> Right edge is selected for clipping";
    logicText.innerHTML = "0" + "0" + "1" + "0" + " " + "&" + " " + convertToBinary(currentPoint) + " " + eqornq + " " + "0";
    if (firstpointStatus == 0) {
      pointStatText.innerHTML = "First Point is Selected";
    } else {
      pointStatText.innerHTML = "Second Point is Selected";
    }
    if (isDark == 0) {
      draw_line(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
      isDark = 1;
    }
    else {
      if ((rightSide & currentPoint) != 0) {
        ifCompleted++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      draw_line(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "yellow");
      status = 2;
      isDark = 0;
    }
  }
  else if (status == 2) {
    let eqornq = "==";
    if ((bottomSide & currentPoint) != 0) {
      eqornq = "!=";
    }
    text.innerHTML = "<br> <br> Bottom edge is selected for clipping";
    logicText.innerHTML = "0" + "1" + "0" + "0" + " " + "&" + " " + convertToBinary(currentPoint) + " " + eqornq + " " + "0";
    if (firstpointStatus == 0) {
      pointStatText.innerHTML = "First Point is Selected";
    } else {
      pointStatText.innerHTML = "Second Point is Selected";
    }
    if (isDark == 0) {
      draw_line(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
      isDark = 1;
    }
    else {
      if ((bottomSide & currentPoint) != 0) {
        ifCompleted++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      draw_line(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "yellow");
      status = 3;
      isDark = 0;
    }
  }
  else if (status == 3) {
    let eqornq = "==";
    if ((topSide & currentPoint) != 0) {
      eqornq = "!=";
    }
    text.innerHTML = "<br> <br> Top edge is selected for clipping";
    logicText.innerHTML = "1" + "0" + "0" + "0" + " " + "&" + " " + convertToBinary(currentPoint) + " " + eqornq + " " + "0";
    if (firstpointStatus == 0) {
      pointStatText.innerHTML = "First Point is Selected";
    } else {
      pointStatText.innerHTML = "Second Point is Selected";
    }
    if (isDark == 0) {
      draw_line(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "violet");
      isDark = 1;
    } else {
      if ((topSide & currentPoint) != 0) {
        ifCompleted++;
        point("#606060", "#606060", "#606060");
        intersection();
        point("blue", "red", "red");
      }
      draw_line(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "yellow");
      status = 0;
      isDark = 0;
    }
  }
}
function findintersection() {
  if (((topLeftLnX - topLeftRectX <= 0) && (bottomRightLnX - topLeftRectX <= 0)) || ((topLeftLnX - bottomRightRectX >= 0) && (bottomRightLnX - bottomleft_rect_x >= 0)) || ((topLeftLnY - topLeftRectY <= 0) && (bottomRightLnY - topLeftRectY <= 0)) || ((topLeftLnY - bottomRightRectY >= 0) && (bottomRightLnY - bottomRightRectY >= 0))) {
    draw_line(topLeftLnX, topLeftLnY, bottomRightLnX, bottomRightLnY, 2, "#606060");
    return 0;
  }
  let slope =
    (bottomRightLnY - topLeftLnY) / (bottomRightLnX - topLeftLnX);
  let y_intercept = topLeftLnY - slope * topLeftLnX;
  let variable = 0;
  if (slope * topLeftRectX + y_intercept < topLeftRectY || slope * topLeftRectX + y_intercept > bottomRightRectY) {
    variable = variable + 1;
  }
  if (slope * bottomRightRectX + y_intercept < topLeftRectY || slope * bottomRightRectX + y_intercept > bottomRightRectY) {
    variable = variable + 1;
  }
  if ((bottomRightRectY - y_intercept) / slope < topLeftRectX || (bottomRightRectY - y_intercept) / slope > bottomRightRectX) {
    variable = variable + 1;
  }
  if ((topLeftRectY - y_intercept) / slope < topLeftRectX || (topLeftRectY - y_intercept) / slope > bottomRightRectX) {
    variable = variable + 1;
  }
  if (variable == 4) {
    draw_line(topLeftLnX, topLeftLnY, bottomRightLnX, bottomRightLnY, 2, "#606060");
    return 0;
  }
  else {
    return 1;
  }
}
function intersection() {
  if (status == 0) {
    let slope = (bottomRightLnY - topLeftLnY) / (bottomRightLnX - topLeftLnX);
    let y_intercept = topLeftLnY - slope * topLeftLnX;
    intersection_y = slope * topLeftRectX + y_intercept;
    intersection_x = topLeftRectX;
    ctx.beginPath();
    if (firstpointStatus == 0) {
      ctx.moveTo(duptopLeftLnX, duptopLeftLnY);
    } else {
      ctx.moveTo(dupbottomRightLnX, dupbottomRightLnY);
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (firstpointStatus == 0) {
      duptopLeftLnX = topLeftLnX;
      duptopLeftLnY = topLeftLnY;
      topLeftLnX = intersection_x;
      topLeftLnY = intersection_y;
    } else {
      dupbottomRightLnX = bottomRightLnX;
      dupbottomRightLnY = bottomRightLnY;
      bottomRightLnX = intersection_x;
      bottomRightLnY = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    currentPoint = currentPoint & (15 - leftSide);
  }
  else if (status == 1) {
    let slope = (bottomRightLnY - topLeftLnY) / (bottomRightLnX - topLeftLnX);
    let y_intercept = topLeftLnY - slope * topLeftLnX;
    intersection_y = slope * bottomRightRectX + y_intercept;
    intersection_x = bottomRightRectX;
    ctx.beginPath();
    if (firstpointStatus == 0) {
      ctx.moveTo(duptopLeftLnX, duptopLeftLnY);
    } else {
      ctx.moveTo(dupbottomRightLnX, dupbottomRightLnY);
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (firstpointStatus == 0) {
      duptopLeftLnX = topLeftLnX;
      duptopLeftLnY = topLeftLnY;
      topLeftLnX = intersection_x;
      topLeftLnY = intersection_y;
    } else {
      dupbottomRightLnX = bottomRightLnX;
      dupbottomRightLnY = bottomRightLnY;
      bottomRightLnX = intersection_x;
      bottomRightLnY = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    currentPoint = currentPoint & (15 - rightSide);
  }
  else if (status == 2) {
    let slope = (bottomRightLnY - topLeftLnY) / (bottomRightLnX - topLeftLnX);
    let y_intercept = topLeftLnY - slope * topLeftLnX;
    intersection_x = (bottomRightRectY - y_intercept) / slope;
    intersection_y = bottomRightRectY;
    ctx.beginPath();
    if (firstpointStatus == 0) {
      ctx.moveTo(duptopLeftLnX, duptopLeftLnY);
    } else {
      ctx.moveTo(dupbottomRightLnX, dupbottomRightLnY);
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (firstpointStatus == 0) {
      duptopLeftLnX = topLeftLnX;
      duptopLeftLnY = topLeftLnY;
      topLeftLnX = intersection_x;
      topLeftLnY = intersection_y;
    } else {
      dupbottomRightLnX = bottomRightLnX;
      dupbottomRightLnY = bottomRightLnY;
      bottomRightLnX = intersection_x;
      bottomRightLnY = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    currentPoint = currentPoint & (15 - bottomSide);
  }
  else if (status == 3) {
    let slope = (bottomRightLnY - topLeftLnY) / (bottomRightLnX - topLeftLnX);
    let y_intercept = topLeftLnY - slope * topLeftLnX;
    intersection_x = (topLeftRectY - y_intercept) / slope;
    intersection_y = topLeftRectY;
    ctx.beginPath();
    if (firstpointStatus == 0) {
      ctx.moveTo(duptopLeftLnX, duptopLeftLnY);
    } else {
      ctx.moveTo(dupbottomRightLnX, dupbottomRightLnY);
    }
    ctx.lineTo(intersection_x, intersection_y);
    if (firstpointStatus == 0) {
      duptopLeftLnX = topLeftLnX;
      duptopLeftLnY = topLeftLnY;
      topLeftLnX = intersection_x;
      topLeftLnY = intersection_y;
    } else {
      dupbottomRightLnX = bottomRightLnX;
      dupbottomRightLnY = bottomRightLnY;
      bottomRightLnX = intersection_x;
      bottomRightLnY = intersection_y;
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#606060";
    ctx.stroke();
    currentPoint = currentPoint & (15 - topSide);
  }
}

main();

nextButton.addEventListener("click", () => {
  noofIterations++;
  check();
});
previousButton.addEventListener("click", () => {
  if (noofIterations == 0 || isClipped == 1) {
    return;
  }
  if (noofIterations == transitionIteration) {
    firstpointStatus = 0;
    currentPoint = 0;
  }
  if (isDark == 1) {
    if (status == 0) {
      draw_line(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "yellow");
      isDark = 0;
    } else if (status == 1) {
      draw_line(bottomRightRectX, bottomRightRectY, bottomRightRectX, topLeftRectY, 2, "yellow");
      isDark = 0;
    } else if (status == 2) {
      draw_line(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "yellow");
      isDark = 0;
    } else if (status == 3) {
      draw_line(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "yellow");
      isDark = 0;
    }
  }
  else {
    if (status == 0) {
      status = 3;
    } else {
      status = (status - 1) % 4;
    }
    if (status == 0) {
      if ((firstpointStatus == 0) & ((firstPoint & leftSide) != 0) || (firstpointStatus == 1) & ((secondPoint & leftSide) != 0)) {
        point("#606060", "#606060", "#606060");
        ctx.beginPath();
        if (firstpointStatus == 0) {
          ctx.moveTo(duptopLeftLnX, duptopLeftLnY);
          topLeftLnX = duptopLeftLnX;
          topLeftLnY = duptopLeftLnY;
          if (duptopLeftLnX == topLeftLnX && duptopLeftLnY == topLeftLnY && topLeftLnX != initialtopLeftLnX & topLeftLnY != initialtopLeftLnY) {
            duptopLeftLnX = initialtopLeftLnX;
            duptopLeftLnY = initialtopLeftLnY;
          }
        } else {
          ctx.moveTo(dupbottomRightLnX, dupbottomRightLnY);
          bottomRightLnX = dupbottomRightLnX;
          bottomRightLnY = dupbottomRightLnY;
          if (dupbottomRightLnX == bottomRightLnX && dupbottomRightLnY == bottomRightLnY && bottomRightLnX != initialbottomRightLnX & bottomRightLnY != initialbottomRightLnY) {
            dupbottomRightLnX = initialbottomRightLnX;
            dupbottomRightLnY = initialbottomRightLnY;
          }
        }
        ctx.lineTo(intersection_x, intersection_y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        draw_line(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "violet");
        isDark = 1;
        currentPoint = currentPoint + 1;
        point("blue", "red", "red");
      } else {
        draw_line(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "violet");
        isDark = 1;
      }
    } else if (status == 1) {
      if ((firstpointStatus == 0) & ((firstPoint & rightSide) != 0) || (firstpointStatus == 1) & ((secondPoint & rightSide) != 0)) {
        point("#606060", "#606060", "#606060");
        ctx.beginPath();
        if (firstpointStatus == 0) {
          ctx.moveTo(duptopLeftLnX, duptopLeftLnY);
          topLeftLnX = duptopLeftLnX;
          topLeftLnY = duptopLeftLnY;
          if (duptopLeftLnX == topLeftLnX && duptopLeftLnY == topLeftLnY && topLeftLnX != initialtopLeftLnX && topLeftLnY != initialtopLeftLnY) {
            duptopLeftLnX = initialtopLeftLnX;
            duptopLeftLnY = initialtopLeftLnY;
          }
        } else {
          ctx.moveTo(dupbottomRightLnX, dupbottomRightLnY);
          bottomRightLnX = dupbottomRightLnX;
          bottomRightLnY = dupbottomRightLnY;
          if (dupbottomRightLnX == bottomRightLnX && dupbottomRightLnY == bottomRightLnY && bottomRightLnX != initialbottomRightLnX && bottomRightLnY != initialbottomRightLnY) {
            dupbottomRightLnX = initialbottomRightLnX;
            dupbottomRightLnY = initialbottomRightLnY;
          }
        }
        ctx.lineTo(intersection_x, intersection_y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        draw_line(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
        isDark = 1;
        currentPoint = currentPoint + 2;
        point("blue", "red", "red");
      } else {
        draw_line(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
        isDark = 1;
      }
    } else if (status == 2) {
      if ((firstpointStatus == 0) & ((firstPoint & bottomSide) != 0) || (firstpointStatus == 1) & ((secondPoint & bottomSide) != 0)) {
        point("#606060", "#606060", "#606060");
        ctx.beginPath();
        if (firstpointStatus == 0) {
          ctx.moveTo(duptopLeftLnX, duptopLeftLnY);
          topLeftLnX = duptopLeftLnX;
          topLeftLnY = duptopLeftLnY;
          if (
            duptopLeftLnX == topLeftLnX &&
            duptopLeftLnY == topLeftLnY &&
            topLeftLnX != initialtopLeftLnX &&
            topLeftLnY != initialtopLeftLnY
          ) {
            duptopLeftLnX = initialtopLeftLnX;
            duptopLeftLnY = initialtopLeftLnY;
          }
        } else {
          ctx.moveTo(dupbottomRightLnX, dupbottomRightLnY);
          bottomRightLnX = dupbottomRightLnX;
          bottomRightLnY = dupbottomRightLnY;
          if (
            dupbottomRightLnX == bottomRightLnX &&
            dupbottomRightLnY == bottomRightLnY &&
            bottomRightLnX != initialbottomRightLnX &&
            bottomRightLnY != initialbottomRightLnY
          ) {
            dupbottomRightLnX = initialbottomRightLnX;
            dupbottomRightLnY = initialbottomRightLnY;
          }
        }
        ctx.lineTo(intersection_x, intersection_y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        draw_line(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
        isDark = 1;
        currentPoint = currentPoint + 4;
        point("blue", "red", "red");
      } else {
        draw_line(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
        isDark = 1;
      }
    } else if (status == 3) {
      if ((firstpointStatus == 0) & ((firstPoint & topSide) != 0) || (firstpointStatus == 1) & ((secondPoint & topSide) != 0)
      ) {
        point("#606060", "#606060", "#606060");
        ctx.beginPath();
        if (firstpointStatus == 0) {
          ctx.moveTo(duptopLeftLnX, duptopLeftLnY);
          topLeftLnX = duptopLeftLnX;
          topLeftLnY = duptopLeftLnY;
          if (duptopLeftLnX == topLeftLnX && duptopLeftLnY == topLeftLnY && topLeftLnX != initialtopLeftLnX && topLeftLnY != initialtopLeftLnY) {
            duptopLeftLnX = initialtopLeftLnX;
            duptopLeftLnY = initialtopLeftLnY;
          }
        }
        else {
          ctx.moveTo(dupbottomRightLnX, dupbottomRightLnY);
          bottomRightLnX = dupbottomRightLnX;
          bottomRightLnY = dupbottomRightLnY;
          if (
            dupbottomRightLnX == bottomRightLnX &&
            dupbottomRightLnY == bottomRightLnY &&
            bottomRightLnX != initialbottomRightLnX &&
            bottomRightLnY != initialbottomRightLnY
          ) {
            dupbottomRightLnX = initialbottomRightLnX;
            dupbottomRightLnY = initialbottomRightLnY;
          }
        }
        ctx.lineTo(intersection_x, intersection_y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        draw_line(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "violet");
        isDark = 1;
        currentPoint = currentPoint + 8;
        point("blue", "red", "red");
      } else {
        draw_line(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "violet");
      }
    }
  }
  noofIterations--;
});
submitButton.addEventListener("click", () => {
  if (noofIterations == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    topLeftRectX = document.getElementById("cnt-top-left-x").value;
    topLeftRectY = document.getElementById("cnt-top-left-y").value;
    bottomRightRectX = document.getElementById("cnt-bottom-right-x").value;
    bottomRightRectY = document.getElementById("cnt-bottom-right-y").value;
    topLeftLnX = document.getElementById("ln-top-left-x").value;
    topLeftLnY = document.getElementById("ln-top-left-y").value;
    bottomRightLnX = document.getElementById("ln-bottom-right-x").value;
    bottomRightLnY = document.getElementById("ln-bottom-right-y").value;
    initialtopLeftLnX = topLeftLnX;
    initialtopLeftLnY = topLeftLnY;
    initialbottomRightLnX = bottomRightLnX;
    initialbottomRightLnY = bottomRightLnY;
    duptopLeftLnX = topLeftLnX;
    duptopLeftLnY = topLeftLnY;
    dupbottomRightLnX = bottomRightLnX;
    dupbottomRightLnY = bottomRightLnY;
    firstPoint = 0;
    secondPoint = 0;
    if (topLeftLnX - topLeftRectX < 0) {
      firstPoint = firstPoint + Math.pow(2, 0);
    }
    if (topLeftLnX - bottomRightRectX > 0) {
      firstPoint = firstPoint + Math.pow(2, 1);
    }
    if (topLeftLnY - bottomRightRectY > 0) {
      firstPoint = firstPoint + Math.pow(2, 2);
    }
    if (topLeftLnY - topLeftRectY < 0) {
      firstPoint = firstPoint + Math.pow(2, 3);
    }

    if (bottomRightLnX - topLeftRectX < 0) {
      secondPoint = secondPoint + Math.pow(2, 0);
    }
    if (bottomRightLnX - bottomRightRectX > 0) {
      secondPoint = secondPoint + Math.pow(2, 1);
    }
    if (bottomRightLnY - bottomRightRectY > 0) {
      secondPoint = secondPoint + Math.pow(2, 2);
    }
    if (bottomRightLnY - topLeftRectY < 0) {
      secondPoint = secondPoint + Math.pow(2, 3);
    }

    if (firstpointStatus == 0) {
      currentPoint = firstPoint;
    } else {
      currentPoint = secondPoint;
    }

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    grid();
    draw_line(topLeftLnX, topLeftLnY, bottomRightLnX, bottomRightLnY, 2, "white");
  }
});

resetButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  topLeftLnX = initialtopLeftLnX;
  topLeftLnY = initialtopLeftLnY;
  bottomRightLnX = initialbottomRightLnX;
  bottomRightLnY = initialbottomRightLnY;
  duptopLeftLnX = topLeftLnX;
  duptopLeftLnY = topLeftLnY;
  dupbottomRightLnX = bottomRightLnX;
  dupbottomRightLnY = bottomRightLnY;
  currentPoint = firstPoint;
  inside = 0;
  isDark = 0;
  ifCompleted = 0;
  firstpointStatus = 0;
  noofIterations = 0;
  status = 0;
  ctx.fillStyle = "black";
  ctx.fill();
  grid();
  draw_line(topLeftLnX, topLeftLnY, bottomRightLnX, bottomRightLnY, 2, "white");
  text.innerHTML = "";
  logicText.innerHTML = "";
  pointStatText.innerHTML = "";
  isClipped = 0;
});
function resize(canvas) {
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = 2 * displayWidth;
    canvas.height = displayHeight;
  }
}