
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
let topLeftRectX = document.getElementById("cnt-top-left-x").value;
let topLeftRectY = document.getElementById("cnt-top-left-y").value;
let bottomRightRectX = document.getElementById("cnt-bottom-right-x").value;
let bottomRightRectY = document.getElementById("cnt-bottom-right-y").value;
let nextButton = document.getElementById("next_button");
let submitButton = document.getElementById("submit");
let previousButton = document.getElementById("prev_button");
let resetButton = document.getElementById("reset_button");
let text = document.getElementById("text");
let logicText = document.getElementById("logic_text");
let pointStatText = document.getElementById("pointstat_text");
let lineStatText = document.getElementById("linestat_text");
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
let firstPointStatus = 0;
let isClipped = 0;
let noOfIterations = 0,
    previousnoOfIterations = [];
transitionIteration = 0,
    previoustransitionIteration = [];
let noOfLinesClipped = 0;
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
function coordinatesText(x, y) {
    ctx.fillStyle = "red";
    ctx.font = "16px serif";
    ctx.fillText("(" + x + "," + y + ")", x - 30, y - 10);
}
function drawLine(x1, y1, x2, y2, width, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
}
function chooseLine() {
    if (noOfLinesClipped == 0) {
        lineStatText.innerHTML = "Clipping line 1";
    }
    else if (noOfLinesClipped == 1) {
        lineStatText.innerHTML = "Clipping line 2";
    }
    else if (noOfLinesClipped == 2) {
        lineStatText.innerHTML = "Clipping line 3";
    }
    else if (noOfLinesClipped == 3) {
        lineStatText.innerHTML = "Clipping line 4";
    }
    else if (noOfLinesClipped == 4) {
        lineStatText.innerHTML = "Clipping line 5";
    }

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
    coordinatesText(topLeftRectX, topLeftRectY);
    coordinatesText(bottomRightRectX, bottomRightRectY);
    coordinatesText(topLeftRectX, bottomRightRectY);
    coordinatesText(bottomRightRectX, topLeftRectY);
    drawLine(0, 0, 0, height, 2, "yellow");
    drawLine(topLeftRectX, 0, topLeftRectX, height, 2, "yellow");
    drawLine(bottomRightRectX, 0, bottomRightRectX, height, 2, "yellow");
    drawLine(0, 0, width, 0, 2, "yellow");
    drawLine(0, topLeftRectY, width, topLeftRectY, 2, "yellow");
    drawLine(0, bottomRightRectY, width, bottomRightRectY, 2, "yellow");
}
function main() {
    grid();
    for (let i = 0; i < noofLines; i++) {
        drawLine(PointsX[i], PointsY[i], PointsX[(i + 1) % noofLines], PointsY[(i + 1) % noofLines], 2, "white");
    }
}
function check() {
    if (isClipped == 1) {
        drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "green");
        drawLine(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "green");
        drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "green");
        drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "green");
        drawLine(topLeftRectX, topLeftRectY, bottomleft_rect_x, bottomRightRectY);

    }
    if (noOfIterations == 1) {
        statusPrev[currentLine] = status;

    }
    if (
        (currentPoint == 0 && firstPointStatus == 1) || findintersection(PointsX[currentLine], PointsX[(currentLine + 1) % noofLines], PointsY[currentLine], PointsY[(currentLine + 1) % noofLines], "#606060") == 0) {
        noOfLinesClipped++;
        if (noOfLinesClipped == noofLines) {
            isClipped = 1;
            return;
        }
        moveToNextLine();
    }
    if (currentPoint == 0 && firstPointStatus == 0) {
        currentPoint = secondPoint;
        firstPointStatus = 1;
        transitionIteration = noOfIterations;
    }
    if (status == 0) {
        let eqornq = "==";
        if ((leftSide & currentPoint) != 0) {
            eqornq = "!=";
        }
        text.innerHTML =
            "<br> <br> Left edge is selected for clipping the line aganist the left point";
        logicText.innerHTML = "0" + "0" + "0" + "1" + " " + "&" + " " + convertToBinary(currentPoint) + " " + eqornq + " " + "0";
        if (firstPointStatus == 0) {
            pointStatText.innerHTML = "First Point is Selected";
        }
        else {
            pointStatText.innerHTML = "Second Point is Selected";
        }
        chooseLine();
        if (isDark == 0) {
            drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "violet");
            isDark = 1;
        }
        else {
            if ((leftSide & currentPoint) != 0) {
                point("#606060", "#606060", "#606060");
                intersection();
                if (firstPointStatus == 0) {
                    point("blue", "red", "red");
                    ifCompleted++;
                }
            }
            drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "yellow");
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
        if (firstPointStatus == 0) {
            pointStatText.innerHTML = "First Point is Selected";
        } else {
            pointStatText.innerHTML = "Second Point is Selected";
        }
        chooseLine();
        if (isDark == 0) {
            drawLine(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
            isDark = 1;
        }
        else {
            if ((rightSide & currentPoint) != 0) {
                ifCompleted++;
                point("#606060", "#606060", "#606060");
                intersection();
                point("blue", "red", "red");
            }
            drawLine(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "yellow");
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
        if (firstPointStatus == 0) {
            pointStatText.innerHTML = "First Point is Selected";
        } else {
            pointStatText.innerHTML = "Second Point is Selected";
        }
        chooseLine();
        if (isDark == 0) {
            drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
            isDark = 1;
        }
        else {
            if ((bottomSide & currentPoint) != 0) {
                ifCompleted++;
                point("#606060", "#606060", "#606060");
                intersection();
                point("blue", "red", "red");
            }
            drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "yellow");
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
        if (firstPointStatus == 0) {
            pointStatText.innerHTML = "First Point is Selected";
        } else {
            pointStatText.innerHTML = "Second Point is Selected";
        }
        chooseLine();
        if (isDark == 0) {
            drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "violet");
            isDark = 1;
        } else {
            if ((topSide & currentPoint) != 0) {
                ifCompleted++;
                point("#606060", "#606060", "#606060");
                intersection();
                point("blue", "red", "red");
            }
            drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "yellow");
            status = 0;
            isDark = 0;
        }
    }
}
function findintersection(x1, x2, y1, y2, colour) {
    if (((x1 - topLeftRectX <= 0) && (x2 - topLeftRectX <= 0)) || ((x1 - bottomRightRectX >= 0) && (x2 - bottomRightRectX >= 0)) || ((y1 - topLeftRectY <= 0) && (y2 - topLeftRectY <= 0)) || ((y1 - bottomRightRectY >= 0) && (y2 - bottomRightRectY >= 0))) {
        drawLine(x1, y1, x2, y2, 2, colour);
        return 0;
    }
    let slope =
        (y2 - y1) / (x2 - x1);
    let y_intercept = y1 - slope * x1;
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
        drawLine(x1, y1, x2, y2, 2, colour);
        return 0;
    }
    else {
        return 1;
    }
}
function intersection() {
    if (status == 0) {
        let slope = (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) / (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
        let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
        intersection_y = slope * topLeftRectX + y_intercept;
        intersection_x = topLeftRectX;
        ctx.beginPath();
        if (firstPointStatus == 0) {
            ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
        } else {
            ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
        }
        ctx.lineTo(intersection_x, intersection_y);
        if (firstPointStatus == 0) {
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
        currentPoint = currentPoint & (15 - leftSide);
    }
    else if (status == 1) {
        let slope = (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) / (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
        let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
        intersection_y = slope * bottomRightRectX + y_intercept;
        intersection_x = bottomRightRectX;
        ctx.beginPath();
        if (firstPointStatus == 0) {
            ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
        } else {
            ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
        }
        ctx.lineTo(intersection_x, intersection_y);
        if (firstPointStatus == 0) {
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
        currentPoint = currentPoint & (15 - rightSide);
    }
    else if (status == 2) {
        let slope = (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) / (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
        let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
        intersection_x = (bottomRightRectY - y_intercept) / slope;
        intersection_y = bottomRightRectY;
        ctx.beginPath();
        if (firstPointStatus == 0) {
            ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
        } else {
            ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
        }
        ctx.lineTo(intersection_x, intersection_y);
        if (firstPointStatus == 0) {
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
        currentPoint = currentPoint & (15 - bottomSide);
    }
    else if (status == 3) {
        let slope = (PointsY[(currentLine + 1) % noofLines] - PointsY[currentLine]) / (PointsX[(currentLine + 1) % noofLines] - PointsX[currentLine]);
        let y_intercept = PointsY[currentLine] - slope * PointsX[currentLine];
        intersection_x = (topLeftRectY - y_intercept) / slope;
        intersection_y = topLeftRectY;
        ctx.beginPath();
        if (firstPointStatus == 0) {
            ctx.moveTo(dupPointsX[currentLine], dupPointsY[currentLine]);
        } else {
            ctx.moveTo(dupPointsX[(currentLine + 1) % noofLines], dupPointsY[(currentLine + 1) % noofLines]);
        }
        ctx.lineTo(intersection_x, intersection_y);
        if (firstPointStatus == 0) {
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
        currentPoint = currentPoint & (15 - topSide);
    }
}

main();

nextButton.addEventListener("click", () => {
    noOfIterations++;
    check();
});
previousButton.addEventListener("click", () => {
    if ((noOfLinesClipped == 0 && noOfIterations == 0) || (isClipped == 1)) {
        return;
    }
    if (previousLine == currentLine - 1 && noOfIterations == 0) {
        noOfLinesClipped--;
        previousLineChange();
        return;
    }
    if (noOfIterations == transitionIteration) {
        firstPointStatus = 0;
        currentPoint = 0;
    }
    if (isDark == 1) {
        if (status == 0) {
            drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "yellow");
            isDark = 0;
        } else if (status == 1) {
            drawLine(bottomRightRectX, bottomRightRectY, bottomRightRectX, topLeftRectY, 2, "yellow");
            isDark = 0;
        } else if (status == 2) {
            drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "yellow");
            isDark = 0;
        } else if (status == 3) {
            drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "yellow");
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
            if ((firstPointStatus == 0) & ((firstPoint & leftSide) != 0) || (firstPointStatus == 1) & ((secondPoint & leftSide) != 0)) {
                point("#606060", "#606060", "#606060");
                ctx.beginPath();
                if (firstPointStatus == 0) {
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
                drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "violet");
                isDark = 1;
                currentPoint = currentPoint + 1;
                point("blue", "red", "red");
            } else {
                drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "violet");
                isDark = 1;
            }
        } else if (status == 1) {
            if ((firstPointStatus == 0) & ((firstPoint & rightSide) != 0) || (firstPointStatus == 1) & ((secondPoint & rightSide) != 0)) {
                point("#606060", "#606060", "#606060");
                ctx.beginPath();
                if (firstPointStatus == 0) {
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
                drawLine(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
                isDark = 1;
                currentPoint = currentPoint + 2;
                point("blue", "red", "red");
            } else {
                drawLine(bottomRightRectX, topLeftRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
                isDark = 1;
            }
        } else if (status == 2) {
            if ((firstPointStatus == 0) & ((firstPoint & bottomSide) != 0) || (firstPointStatus == 1) & ((secondPoint & bottomSide) != 0)) {
                point("#606060", "#606060", "#606060");
                ctx.beginPath();
                if (firstPointStatus == 0) {
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
                drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
                isDark = 1;
                currentPoint = currentPoint + 4;
                point("blue", "red", "red");
            } else {
                drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "violet");
                isDark = 1;
            }
        } else if (status == 3) {
            if ((firstPointStatus == 0) & ((firstPoint & topSide) != 0) || (firstPointStatus == 1) & ((secondPoint & topSide) != 0)
            ) {
                point("#606060", "#606060", "#606060");
                ctx.beginPath();
                if (firstPointStatus == 0) {
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
                ctx.strokeStyle = "white";
                ctx.stroke();
                drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "violet");
                isDark = 1;
                currentPoint = currentPoint + 8;
                point("blue", "red", "red");
            } else {
                drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "violet");
            }
        }
    }
    noOfIterations--;
});

function computeNewPointsBinary(PointsX, PointsY, x, y) {
    firstPoint = 0;
    secondPoint = 0;
    if (PointsX[x] - topLeftRectX < 0) {
        firstPoint = firstPoint + Math.pow(2, 0);
    }
    if (PointsX[x] - bottomRightRectX > 0) {
        firstPoint = firstPoint + Math.pow(2, 1);
    }
    if (PointsY[x] - bottomRightRectY > 0) {
        firstPoint = firstPoint + Math.pow(2, 2);
    }
    if (PointsY[x] - topLeftRectY < 0) {
        firstPoint = firstPoint + Math.pow(2, 3);
    }

    if (PointsX[y] - topLeftRectX < 0) {
        secondPoint = secondPoint + Math.pow(2, 0);
    }
    if (PointsX[y] - bottomRightRectX > 0) {
        secondPoint = secondPoint + Math.pow(2, 1);
    }
    if (PointsY[y] - bottomRightRectY > 0) {
        secondPoint = secondPoint + Math.pow(2, 2);
    }
    if (PointsY[y] - topLeftRectY < 0) {
        secondPoint = secondPoint + Math.pow(2, 3);
    }

}
submitButton.addEventListener("click", () => {
    if (noOfIterations == 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        topLeftRectX = document.getElementById("cnt-top-left-x").value;
        topLeftRectY = document.getElementById("cnt-top-left-y").value;
        bottomRightRectX = document.getElementById("cnt-bottom-right-x").value;
        bottomRightRectY = document.getElementById("cnt-bottom-right-y").value;
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
        computeNewPointsBinary(PointsX, PointsY, 0, 1);
        if (firstPointStatus == 0) {
            currentPoint = firstPoint;
        } else {
            currentPoint = secondPoint;
        }
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fill();
        grid();
        currentLine = 0;
        for (let i = 0; i < noofLines; i++) {
            drawLine(PointsX[i], PointsY[i], PointsX[(i + 1) % noofLines], PointsY[(i + 1) % noofLines], 2, "white");
        }
    }
});

resetButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    grid();
    for (let i = 0; i < noofLines; i++) {
        PointsX[i] = initialPointsX[i];
        PointsY[i] = initialPointsY[i];
        dupPointsX[i] = initialPointsX[i];
        dupPointsY[i] = initialPointsY[i];
    }
    for (let i = 0; i < noofLines; i++) {
        drawLine(PointsX[i], PointsY[i], PointsX[(i + 1) % noofLines], PointsY[(i + 1) % noofLines], 2, "white");
    }
    status = 0;
    statusPrev = [];
    statusPrev[0] = status;
    currentLine = 0;
    previousLine = 0;
    for (let i = 0; i < noofLines; i++) {
        prevPointsX[i] = [];
        prevPointsY[i] = [];
        prevdupPointsX[i] = [];
        prevdupPointsY[i] = [];
    }
    intersection_x, intersection_y, previousIntersection_x = [], previousIntersection_y = [];
    computeNewPointsBinary(PointsX, PointsY, 0, 1);
    currentPoint = firstPoint;
    inside = 0;
    isDark = 0;
    ifCompleted = 0;
    firstPointStatus = 0;
    isClipped = 0;
    noOfIterations = 0,
        previousnoOfIterations = [];
    transitionIteration = 0,
        previoustransitionIteration = [];
    noOfLinesClipped = 0;
});
function resize(canvas) {
    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = 2 * displayWidth;
        canvas.height = displayHeight;
    }
}
function previousLineChange() {
    if (isDark == 1) {
        if (status == 0) {
            drawLine(topLeftRectX, topLeftRectY, topLeftRectX, bottomRightRectY, 2, "yellow");
            isDark = 0;
        } else if (status == 1) {
            drawLine(bottomRightRectX, bottomRightRectY, bottomRightRectX, topLeftRectY, 2, "yellow");
            isDark = 0;
        } else if (status == 2) {
            drawLine(topLeftRectX, bottomRightRectY, bottomRightRectX, bottomRightRectY, 2, "yellow");
            isDark = 0;
        } else if (status == 3) {
            drawLine(topLeftRectX, topLeftRectY, bottomRightRectX, topLeftRectY, 2, "yellow");
            isDark = 0;
        }
    }
    findintersection(initialPointsX[currentLine], initialPointsX[(currentLine + 1) % noofLines], initialPointsY[currentLine], initialPointsY[(currentLine + 1) % noofLines], "white");
    firstPointStatus = 1;
    if (currentLine == 0) {
        currentLine = noofLines - 1;
        previousLine = noofLines - 1;
    }
    else {
        currentLine = currentLine - 1;
        previousLine = previousLine - 1;
    }
    for (let i = 0; i < noofLines; i++) {
        PointsX[i] = prevPointsX[i][currentLine];
        PointsY[i] = prevPointsY[i][currentLine];
        dupPointsX[i] = prevdupPointsX[i][currentLine];
        dupPointsY[i] = prevdupPointsY[i][currentLine];
    }
    noOfIterations = previousnoOfIterations[currentLine];
    transitionIteration = previoustransitionIteration[currentLine];
    currentPoint = 0;
    computeNewPointsBinary(initialPointsX, initialPointsY, currentLine, (currentLine + 1) % noofLines);
    isDark = 0;
    currentPoint = 0;
    intersection_x = previousIntersection_x[currentLine];
    intersection_y = previousIntersection_y[currentLine];
}
function moveToNextLine() {
    previousIntersection_x[currentLine] = intersection_x;
    previousIntersection_y[currentLine] = intersection_y;
    for (let i = 0; i < noofLines; i++) {
        prevPointsX[i][currentLine] = PointsX[i];
        prevPointsY[i][currentLine] = PointsY[i];
        prevdupPointsX[i][currentLine] = dupPointsX[i];
        prevdupPointsY[i][currentLine] = dupPointsY[i];
    }
    previousnoOfIterations[currentLine] = noOfIterations - 1;
    previoustransitionIteration[currentLine] = transitionIteration;
    for (let i = 0; i < noofLines; i++) {
        PointsX[i] = initialPointsX[i];
        PointsY[i] = initialPointsY[i];
        dupPointsX[i] = PointsX[i];
        dupPointsY[i] = PointsY[i];
    }
    previousLine = currentLine;
    currentLine = (currentLine + 1) % noofLines;
    firstPointStatus = 0;
    noOfIterations = 0;
    transitionIteration = 0;
    isDark = 0;
    computeNewPointsBinary(PointsX, PointsY, currentLine, (currentLine + 1) % noofLines);
    if (firstPointStatus == 0) {
        currentPoint = firstPoint;
    } else {
        currentPoint = secondPoint;
    }
}