
let canvas = document.getElementById("canvas");
var heightRatio = 1;
canvas.height = canvas.width * heightRatio;
resize(canvas);
let ctx = canvas.getContext("2d");
let status = 0;
let statusPrev = [];
statusPrev[0] = status;
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
let noofLines = 5;
let currentLine = 0;
let previousLine = 0;
let topleft_rect_x = document.getElementById("cnt-top-left-x").value;
let topleft_rect_y = document.getElementById("cnt-top-left-y").value;
let bottomright_rect_x = document.getElementById("cnt-bottom-right-x").value;
let bottomright_rect_y = document.getElementById("cnt-bottom-right-y").value;
let next_button = document.getElementById("next_button");
let submit_button = document.getElementById("submit");
let previous_button = document.getElementById("prev_button");
let reset_button = document.getElementById("reset_button");
let text = document.getElementById("text");
let logic_text = document.getElementById("logic_text");
let pointstat_text = document.getElementById("pointstat_text");
const PointsX = [], PointsY = [], initialPointsX = [], initialPointsY = [], dupPointsX = [], dupPointsY = [], lineCoordinatesX = [], lineCoordinatesY = [];
const prevPointsX = [], prevPointsY = [], prevdupPointsX = [], prevdupPointsY = [];
for (let i = 0; i < noofLines; i++) {
    prevPointsX[i] = [];
    prevPointsY[i] = [];
    prevdupPointsX[i] = [];
    prevdupPointsY[i] = [];
}
PointsX[0] = document.getElementById("firstPointX").value;
PointsY[0] = document.getElementById("firstPointY").value;
PointsX[1] = document.getElementById("secondPointX").value;
PointsY[1] = document.getElementById("secondPointY").value;
PointsX[2] = document.getElementById("thirdPointX").value;
PointsY[2] = document.getElementById("thirdPointY").value;
PointsX[3] = document.getElementById("FourthPointX").value;
PointsY[3] = document.getElementById("FourthPointY").value;
PointsX[4] = document.getElementById("FifthPointX").value;
PointsY[4] = document.getElementById("FifthPointY").value;

for (let i = 0; i < noofLines; i++) {
    initialPointsX[i] = PointsX[i];
    lineCoordinatesX[i] = PointsX[i];
    initialPointsY[i] = PointsY[i];
    lineCoordinatesY[i] = PointsY[i];
    dupPointsX[i] = PointsX[i];
    initialPointsY[i] = PointsY[i];
    dupPointsY[i] = PointsY[i];
};
let intersection_x, intersection_y, previousIntersection_x = [], previousIntersection_y = [];
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
    previousno_of_iterations = [];
transition_iteration = 0,
    previoustransition_iteration = [];
let no_of_linesclipped = 0;
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
    for (let i = 0; i < noofLines; i++) {
        ctx.beginPath();
        ctx.arc(PointsX[i], PointsY[i], 2, 0, 2 * Math.PI, false);
        ctx.lineWidth = 5;
        ctx.strokeStyle = colour1;
        ctx.stroke();
    }
    for (let i = 0; i < noofLines; i++) {
        ctx.font = "16px serif";
        ctx.fillText(
            "(" + parseInt(PointsX[i]) + "," + parseInt(PointsY[i]) + ")",
            parseInt(PointsX[i]),
            parseInt(PointsY[i] - 10)
        );
        ctx.fillStyle = colour3;

    }
    for (let i = 0; i < noofLines; i++) {
        ctx.font = "16px serif";
        ctx.fillText(
            "(" + parseInt(PointsX[i]) + "," + parseInt(PointsY[i]) + ")",
            parseInt(PointsX[i]),
            parseInt(PointsY[i] - 10)
        );
        ctx.fillStyle = colour2;
    }
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
    for (let i = 0; i < noofLines; i++) {
        draw_line(PointsX[i], PointsY[i], PointsX[(i + 1) % noofLines], PointsY[(i + 1) % noofLines], 2, "white");
    }
}
function check() {
    console.log(no_of_iterations);
    console.log(no_of_linesclipped);
    if (is_clipped == 1) {
        draw_line(topleft_rect_x, topleft_rect_y, topleft_rect_x, bottomright_rect_y, 2, "green");
        draw_line(bottomright_rect_x, topleft_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "green");
        draw_line(topleft_rect_x, topleft_rect_y, bottomright_rect_x, topleft_rect_y, 2, "green");
        draw_line(topleft_rect_x, bottomright_rect_y, bottomright_rect_x, bottomright_rect_y, 2, "green");
        draw_line(topleft_rect_x, topleft_rect_y, bottomleft_rect_x, bottomright_rect_y);

    }
    if (no_of_iterations == 1) {
        statusPrev[currentLine] = status;
        console.log(statusPrev[1]);

    }
    console.log(status);
    if (
        (current_point == 0 && first_point_status == 1) || findintersection(PointsX[currentLine], PointsX[(currentLine + 1) % noofLines], PointsY[currentLine], PointsY[(currentLine + 1) % noofLines], "#606060") == 0) {
        no_of_linesclipped++;
        if (no_of_linesclipped == noofLines) {
            is_clipped = 1;
            return;
        }
        text.innerHTML = "<br><br>Line is Clipped";
        logic_text.innerHTML = "";
        pointstat_text.innerHTML = "";
        move_to_next_line();
    }
    if (current_point == 0 && first_point_status == 0) {
        current_point = second_point;
        first_point_status = 1;
        console.log("Hello I am herjiwiw", no_of_iterations);
        transition_iteration = no_of_iterations;
    }
    if (status == 0) {
        let eqornq = "==";
        if ((left_side & current_point) != 0) {
            eqornq = "!=";
        }
        text.innerHTML =
            "<br> <br> Left edge is selected for clipping the line aganist the left point";
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
        console.log(current_point);
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
function findintersection(x1, x2, y1, y2, colour) {
    if (((x1 - topleft_rect_x <= 0) && (x2 - topleft_rect_x <= 0)) || ((x1 - bottomright_rect_x >= 0) && (x2 - bottomright_rect_x >= 0)) || ((y1 - topleft_rect_y <= 0) && (y2 - topleft_rect_y <= 0)) || ((y1 - bottomright_rect_y >= 0) && (y2 - bottomright_rect_y >= 0))) {
        draw_line(x1, y1, x2, y2, 2, colour);
        return 0;
    }
    let slope =
        (y2 - y1) / (x2 - x1);
    let y_intercept = y1 - slope * x1;
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
        draw_line(x1, y1, x2, y2, 2, colour);
        return 0;
    }
    else {
        return 1;
    }
}
function intersection() {
    // find the intersection of point with the line edges
    if (status == 0) {
        let slope = (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) / (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
        let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
        intersection_y = slope * topleft_rect_x + y_intercept;
        intersection_x = topleft_rect_x;
        ctx.beginPath();
        if (first_point_status == 0) {
            ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
        } else {
            ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
        }
        ctx.lineTo(intersection_x, intersection_y);
        if (first_point_status == 0) {
            dupPointsX[currentLine] = PointsX[currentLine];
            dupPointsY[currentLine] = PointsY[currentLine];
            PointsX[currentLine] = intersection_x;
            PointsY[currentLine] = intersection_y;
        } else {
            dupPointsX[(currentLine + 1) % noofLines] = PointsX[(currentLine + 1) % noofLines];
            dupPointsY[(currentLine + 1) % noofLines] = PointsY[(currentLine + 1) % noofLines];
            PointsX[(currentLine + 1) % noofLines] = intersection_x;
            PointsY[(currentLine + 1) % noofLines] = intersection_y;
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#606060";
        ctx.stroke();
        current_point = current_point & (15 - left_side);
    }
    else if (status == 1) {
        let slope = (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) / (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
        let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
        intersection_y = slope * bottomright_rect_x + y_intercept;
        intersection_x = bottomright_rect_x;
        ctx.beginPath();
        if (first_point_status == 0) {
            ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
        } else {
            ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
        }
        ctx.lineTo(intersection_x, intersection_y);
        if (first_point_status == 0) {
            dupPointsX[currentLine] = PointsX[currentLine];
            dupPointsY[currentLine] = PointsY[currentLine];
            PointsX[currentLine] = intersection_x;
            PointsY[currentLine] = intersection_y;
        } else {
            dupPointsX[(currentLine + 1) % noofLines] = PointsX[(currentLine + 1) % noofLines];
            dupPointsY[(currentLine + 1) % noofLines] = PointsY[(currentLine + 1) % noofLines];
            PointsX[(currentLine + 1) % noofLines] = intersection_x;
            PointsY[(currentLine + 1) % noofLines] = intersection_y;
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#606060";
        ctx.stroke();
        current_point = current_point & (15 - right_side);
    }
    else if (status == 2) {
        let slope = (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) / (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
        let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
        intersection_x = (bottomright_rect_y - y_intercept) / slope;
        intersection_y = bottomright_rect_y;
        ctx.beginPath();
        if (first_point_status == 0) {
            ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
        } else {
            ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
        }
        ctx.lineTo(intersection_x, intersection_y);
        if (first_point_status == 0) {
            dupPointsX[currentLine] = PointsX[currentLine];
            dupPointsY[currentLine] = PointsY[currentLine];
            PointsX[currentLine] = intersection_x;
            PointsY[currentLine] = intersection_y;
        } else {
            dupPointsX[(currentLine + 1) % noofLines] = PointsX[(currentLine + 1) % noofLines];
            dupPointsY[(currentLine + 1) % noofLines] = PointsY[(currentLine + 1) % noofLines];
            PointsX[(currentLine + 1) % noofLines] = intersection_x;
            PointsY[(currentLine + 1) % noofLines] = intersection_y;
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#606060";
        ctx.stroke();
        current_point = current_point & (15 - bottom_side);
    }
    else if (status == 3) {
        let slope = (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) / (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
        let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
        intersection_x = (topleft_rect_y - y_intercept) / slope;
        intersection_y = topleft_rect_y;
        ctx.beginPath();
        if (first_point_status == 0) {
            ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
        } else {
            ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
        }
        ctx.lineTo(intersection_x, intersection_y);
        if (first_point_status == 0) {
            dupPointsX[currentLine] = PointsX[currentLine];
            dupPointsY[currentLine] = PointsY[currentLine];
            PointsX[currentLine] = intersection_x;
            PointsY[currentLine] = intersection_y;
        } else {
            dupPointsX[(currentLine + 1) % noofLines] = PointsX[(currentLine + 1) % noofLines];
            dupPointsY[(currentLine + 1) % noofLines] = PointsY[(currentLine + 1) % noofLines];
            PointsX[(currentLine + 1) % noofLines] = intersection_x;
            PointsY[(currentLine + 1) % noofLines] = intersection_y;
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
    console.log("In next_button function", intersection_x, intersection_y);
    no_of_iterations++;
    console.log(no_of_iterations);
    check();
});
previous_button.addEventListener("click", () => {
    console.log("Hello");
    if ((no_of_linesclipped == 0 && no_of_iterations == 0) || (is_clipped == 1)) {
        return;
    }
    if (previousLine == currentLine - 1 && no_of_iterations == 0) {
        no_of_linesclipped--;
        previous_linechange();
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
                    ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
                    PointsX[currentLine] = dupPointsX[currentLine];
                    PointsY[currentLine] = dupPointsY[currentLine];
                    if (dupPointsX[currentLine] == PointsX[currentLine] && dupPointsY[currentLine] == PointsY[currentLine] && PointsX[currentLine] != initialPointsX[currentLine] & PointsY[currentLine] != initialPointsY[currentLine]) {
                        dupPointsX[currentLine] = initialPointsX[currentLine];
                        dupPointsY[currentLine] = initialPointsY[currentLine];
                    }
                } else {
                    ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
                    PointsX[(currentLine + 1) % noofLines] = dupPointsX[(currentLine + 1) % noofLines];
                    PointsY[(currentLine + 1) % noofLines] = dupPointsY[(currentLine + 1) % noofLines];
                    if (dupPointsX[(currentLine + 1) % noofLines] == PointsX[(currentLine + 1) % noofLines] && dupPointsY[(currentLine + 1) % noofLines] == PointsY[(currentLine + 1) % noofLines] && PointsX[(currentLine + 1) % noofLines] != initialPointsX[(currentLine + 1) % noofLines] & PointsY[(currentLine + 1) % noofLines] != initialPointsY[(currentLine + 1) % noofLines]) {
                        dupPointsX[(currentLine + 1) % noofLines] = initialPointsX[(currentLine + 1) % noofLines];
                        dupPointsY[(currentLine + 1) % noofLines] = initialPointsY[(currentLine + 1) % noofLines];
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
                    ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
                    PointsX[currentLine] = dupPointsX[currentLine];
                    PointsY[currentLine] = dupPointsY[currentLine];
                    if (dupPointsX[currentLine] == PointsX[currentLine] && dupPointsY[currentLine] == PointsY[currentLine] && PointsX[currentLine] != initialPointsX[currentLine] && PointsY[currentLine] != initialPointsY[currentLine]) {
                        dupPointsX[currentLine] = initialPointsX[currentLine];
                        dupPointsY[currentLine] = initialPointsY[currentLine];
                    }
                } else {
                    ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
                    PointsX[(currentLine + 1) % noofLines] = dupPointsX[(currentLine + 1) % noofLines];
                    PointsY[(currentLine + 1) % noofLines] = dupPointsY[(currentLine + 1) % noofLines];
                    if (dupPointsX[(currentLine + 1) % noofLines] == PointsX[(currentLine + 1) % noofLines] && dupPointsY[(currentLine + 1) % noofLines] == PointsY[(currentLine + 1) % noofLines] && PointsX[(currentLine + 1) % noofLines] != initialPointsX[(currentLine + 1) % noofLines] && PointsY[(currentLine + 1) % noofLines] != initialPointsY[(currentLine + 1) % noofLines]) {
                        dupPointsX[(currentLine + 1) % noofLines] = initialPointsX[(currentLine + 1) % noofLines];
                        dupPointsY[(currentLine + 1) % noofLines] = initialPointsY[(currentLine + 1) % noofLines];
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
                    ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
                    PointsX[currentLine] = dupPointsX[currentLine];
                    PointsY[currentLine] = dupPointsY[currentLine];
                    if (
                        dupPointsX[currentLine] == PointsX[currentLine] &&
                        dupPointsY[currentLine] == PointsY[currentLine] &&
                        PointsX[currentLine] != initialPointsX[currentLine] &&
                        PointsY[currentLine] != initialPointsY[currentLine]
                    ) {
                        dupPointsX[currentLine] = initialPointsX[currentLine];
                        dupPointsY[currentLine] = initialPointsY[currentLine];
                    }
                } else {
                    ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
                    PointsX[(currentLine + 1) % noofLines] = dupPointsX[(currentLine + 1) % noofLines];
                    PointsY[(currentLine + 1) % noofLines] = dupPointsY[(currentLine + 1) % noofLines];
                    if (
                        dupPointsX[(currentLine + 1) % noofLines] == PointsX[(currentLine + 1) % noofLines] &&
                        dupPointsY[(currentLine + 1) % noofLines] == PointsY[(currentLine + 1) % noofLines] &&
                        PointsX[(currentLine + 1) % noofLines] != initialPointsX[(currentLine + 1) % noofLines] &&
                        PointsY[(currentLine + 1) % noofLines] != initialPointsY[(currentLine + 1) % noofLines]
                    ) {
                        dupPointsX[(currentLine + 1) % noofLines] = initialPointsX[(currentLine + 1) % noofLines];
                        dupPointsY[(currentLine + 1) % noofLines] = initialPointsY[(currentLine + 1) % noofLines];
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
                    ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
                    PointsX[currentLine] = dupPointsX[currentLine];
                    PointsY[currentLine] = dupPointsY[currentLine];
                    if (dupPointsX[currentLine] == PointsX[currentLine] && dupPointsY[currentLine] == PointsY[currentLine] && PointsX[currentLine] != initialPointsX[currentLine] && PointsY[currentLine] != initialPointsY[currentLine]) {
                        dupPointsX[currentLine] = initialPointsX[currentLine];
                        dupPointsY[currentLine] = initialPointsY[currentLine];
                    }
                }
                else {
                    ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
                    PointsX[(currentLine + 1) % noofLines] = dupPointsX[(currentLine + 1) % noofLines];
                    PointsY[(currentLine + 1) % noofLines] = dupPointsY[(currentLine + 1) % noofLines];
                    if (
                        dupPointsX[(currentLine + 1) % noofLines] == PointsX[(currentLine + 1) % noofLines] &&
                        dupPointsY[(currentLine + 1) % noofLines] == PointsY[(currentLine + 1) % noofLines] &&
                        PointsX[(currentLine + 1) % noofLines] != initialPointsX[(currentLine + 1) % noofLines] &&
                        PointsY[(currentLine + 1) % noofLines] != initialPointsY[(currentLine + 1) % noofLines]
                    ) {
                        dupPointsX[(currentLine + 1) % noofLines] = initialPointsX[(currentLine + 1) % noofLines];
                        dupPointsY[(currentLine + 1) % noofLines] = initialPointsY[(currentLine + 1) % noofLines];
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
        PointsX[0] = document.getElementById("firstPointX").value;
        PointsY[0] = document.getElementById("firstPointY").value;
        PointsX[1] = document.getElementById("secondPointX").value;
        PointsY[1] = document.getElementById("secondPointY").value;
        PointsX[2] = document.getElementById("thirdPointX").value;
        PointsY[2] = document.getElementById("thirdPointY").value;
        PointsX[3] = document.getElementById("FourthPointX").value;
        PointsY[3] = document.getElementById("FourthPointY").value;
        PointsX[4] = document.getElementById("FifthPointX").value;
        PointsY[4] = document.getElementById("FifthPointY").value;
        for (let i = 0; i < noofLines; i++) {
            initialPointsX[i] = PointsX[i];
            dupPointsX[i] = PointsX[i];
            initialPointsY[i] = PointsY[i];
            dupPointsY[i] = PointsY[i];
        };
        first_point = 0;
        second_point = 0;
        if (PointsX[0] - topleft_rect_x < 0) {
            first_point = first_point + Math.pow(2, 0);
        }
        if (PointsX[0] - bottomright_rect_x > 0) {
            first_point = first_point + Math.pow(2, 1);
        }
        if (PointsY[0] - bottomright_rect_y > 0) {
            first_point = first_point + Math.pow(2, 2);
        }
        if (PointsY[0] - topleft_rect_y < 0) {
            first_point = first_point + Math.pow(2, 3);
        }

        if (PointsX[1] - topleft_rect_x < 0) {
            second_point = second_point + Math.pow(2, 0);
        }
        if (PointsX[1] - bottomright_rect_x > 0) {
            second_point = second_point + Math.pow(2, 1);
        }
        if (PointsY[1] - bottomright_rect_y > 0) {
            second_point = second_point + Math.pow(2, 2);
        }
        if (PointsY[1] - topleft_rect_y < 0) {
            second_point = second_point + Math.pow(2, 3);
        }

        if (first_point_status == 0) {
            current_point = first_point;
        } else {
            current_point = second_point;
        }
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fill();
        grid();
        currentLine = 0;
        for (let i = 0; i < noofLines; i++) {
            console.log("Hello");
            draw_line(PointsX[i], PointsY[i], PointsX[(i + 1) % noofLines], PointsY[(i + 1) % noofLines], 2, "white");
        }
    }
});

reset_button.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    PointsX[currentLine] = initialPointsX[currentLine];
    PointsY[currentLine] = initialPointsY[currentLine];
    PointsX[(currentLine + 1) % noofLines] = initialPointsX[(currentLine + 1) % noofLines];
    PointsY[(currentLine + 1) % noofLines] = initialPointsY[(currentLine + 1) % noofLines];
    dupPointsX[currentLine] = PointsX[currentLine];
    dupPointsY[currentLine] = PointsY[currentLine];
    dupPointsX[(currentLine + 1) % noofLines] = PointsX[(currentLine + 1) % noofLines];
    dupPointsY[(currentLine + 1) % noofLines] = PointsY[(currentLine + 1) % noofLines];
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
    draw_line(PointsX[currentLine], PointsY[currentLine], PointsX[(currentLine + 1) % noofLines], PointsY[(currentLine + 1) % noofLines], 2, "white");
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
function previous_linechange() {
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
    findintersection(initialPointsX[currentLine], initialPointsX[(currentLine + 1) % noofLines], initialPointsY[currentLine], initialPointsY[(currentLine + 1) % noofLines], "white");
    console.log("WHoooo");
    console.log(intersection_x, intersection_y, previousIntersection_x, previousIntersection_y);
    first_point_status = 1;
    if (currentLine == 0) {
        currentLine = noofLines - 1;
        previousLine = noofLines - 1;
    }
    else {
        currentLine = currentLine - 1;
        previousLine = previousLine - 1;
    }
    console.log("The current line is", currentLine);
    for (let i = 0; i < noofLines; i++) {
        PointsX[i] = prevPointsX[i][currentLine];
        PointsY[i] = prevPointsY[i][currentLine];
        dupPointsX[i] = prevdupPointsX[i][currentLine];
        dupPointsY[i] = prevdupPointsY[i][currentLine];
    }
    console.log("Previous DUp points are", prevdupPointsX[0], prevdupPointsY[0], prevdupPointsX[1], prevdupPointsY[1], prevdupPointsX[2], prevdupPointsY[2], prevdupPointsX[3], prevdupPointsY[3]);
    no_of_iterations = previousno_of_iterations[currentLine];
    transition_iteration = previoustransition_iteration[currentLine];
    console.log("Previous no of iterations", no_of_iterations, transition_iteration);
    current_point = 0;
    first_point = 0;
    second_point = 0;
    console.log(initialPointsX[currentLine], initialPointsY[currentLine], initialPointsX[(currentLine + 1) % noofLines], initialPointsY[(currentLine + 1) % noofLines], intersection_x, intersection_y);
    if (initialPointsX[currentLine] - topleft_rect_x < 0) {
        first_point = first_point + Math.pow(2, 0);
    }
    if (initialPointsX[currentLine] - bottomright_rect_x > 0) {
        first_point = first_point + Math.pow(2, 1);
    }
    if (initialPointsY[currentLine] - bottomright_rect_y > 0) {
        first_point = first_point + Math.pow(2, 2);
    }
    if (initialPointsY[currentLine] - topleft_rect_y < 0) {
        first_point = first_point + Math.pow(2, 3);
    }

    if (initialPointsX[(currentLine + 1) % noofLines] - topleft_rect_x < 0) {
        second_point = second_point + Math.pow(2, 0);
    }
    if (initialPointsX[(currentLine + 1) % noofLines] - bottomright_rect_x > 0) {
        second_point = second_point + Math.pow(2, 1);
    }
    if (initialPointsY[(currentLine + 1) % noofLines] - bottomright_rect_y > 0) {
        second_point = second_point + Math.pow(2, 2);
    }
    if (initialPointsY[(currentLine + 1) % noofLines] - topleft_rect_y < 0) {
        second_point = second_point + Math.pow(2, 3);
    }
    is_dark = 0;
    current_point = 0;
    intersection_x = previousIntersection_x[currentLine];
    intersection_y = previousIntersection_y[currentLine];
    console.log(PointsX[currentLine], PointsY[currentLine], PointsX[(currentLine + 1) % noofLines], PointsY[(currentLine + 1) % noofLines], dupPointsX[currentLine], dupPointsY[currentLine], dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines], initialPointsX[currentLine], initialPointsY[currentLine], initialPointsX[(currentLine + 1) % noofLines], initialPointsY[(currentLine + 1) % noofLines], no_of_iterations, status, is_dark, is_clipped, first_point, second_point, current_point);
    // status = 0;*/
}
function move_to_next_line() {
    console.log("I am here");
    previousIntersection_x[currentLine] = intersection_x;
    previousIntersection_y[currentLine] = intersection_y;
    console.log(PointsX[currentLine], PointsY[currentLine], PointsX[(currentLine + 1) % noofLines], PointsY[(currentLine + 1) % noofLines], dupPointsX[currentLine], dupPointsY[currentLine], dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines], initialPointsX[currentLine], initialPointsY[currentLine], initialPointsX[(currentLine + 1) % noofLines], initialPointsY[(currentLine + 1) % noofLines], no_of_iterations, status, is_dark, is_clipped, first_point, second_point, current_point, intersection_x, intersection_y);
    for (let i = 0; i < noofLines; i++) {
        prevPointsX[i][currentLine] = PointsX[i];
        prevPointsY[i][currentLine] = PointsY[i];
        prevdupPointsX[i][currentLine] = dupPointsX[i];
        prevdupPointsY[i][currentLine] = dupPointsY[i];
    }
    previousno_of_iterations[currentLine] = no_of_iterations - 1;
    previoustransition_iteration[currentLine] = transition_iteration;
    console.log("move");
    console.log(first_point, second_point, current_point, currentLine, PointsX[currentLine], PointsY[currentLine], PointsX[(currentLine + 1) % noofLines], PointsY[(currentLine + 1) % noofLines], initialPointsX[currentLine], initialPointsY[currentLine], initialPointsX[(currentLine + 1) % noofLines], initialPointsY[(currentLine + 1) % noofLines], dupPointsX[currentLine], dupPointsY[currentLine], dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
    for (let i = 0; i < noofLines; i++) {
        PointsX[i] = initialPointsX[i];
        PointsY[i] = initialPointsY[i];
        dupPointsX[i] = PointsX[i];
        dupPointsY[i] = PointsY[i];
    }
    previousLine = currentLine;
    currentLine = (currentLine + 1) % noofLines;
    first_point = 0;
    second_point = 0;
    first_point_status = 0;
    no_of_iterations = 0;
    transition_iteration = 0;
    // is_clipped = 0;
    is_dark = 0;

    if (PointsX[currentLine] - topleft_rect_x < 0) {
        first_point = first_point + Math.pow(2, 0);
    }
    if (PointsX[currentLine] - bottomright_rect_x > 0) {
        first_point = first_point + Math.pow(2, 1);
    }
    if (PointsY[currentLine] - bottomright_rect_y > 0) {
        first_point = first_point + Math.pow(2, 2);
    }
    if (PointsY[currentLine] - topleft_rect_y < 0) {
        first_point = first_point + Math.pow(2, 3);
    }

    if (PointsX[(currentLine + 1) % noofLines] - topleft_rect_x < 0) {
        second_point = second_point + Math.pow(2, 0);
    }
    if (PointsX[(currentLine + 1) % noofLines] - bottomright_rect_x > 0) {
        second_point = second_point + Math.pow(2, 1);
    }
    if (PointsY[(currentLine + 1) % noofLines] - bottomright_rect_y > 0) {
        second_point = second_point + Math.pow(2, 2);
    }
    if (PointsY[(currentLine + 1) % noofLines] - topleft_rect_y < 0) {
        second_point = second_point + Math.pow(2, 3);
    }

    if (first_point_status == 0) {
        current_point = first_point;
    } else {
        current_point = second_point;
    }
    console.log(no_of_iterations);
    console.log(first_point, second_point, current_point, currentLine, PointsX[currentLine], PointsY[currentLine], PointsX[(currentLine + 1) % noofLines], PointsY[(currentLine + 1) % noofLines], initialPointsX[currentLine], initialPointsY[currentLine], initialPointsX[(currentLine + 1) % noofLines], initialPointsY[(currentLine + 1) % noofLines], dupPointsX[currentLine], dupPointsY[currentLine], dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
}