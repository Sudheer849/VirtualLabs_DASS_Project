const submitBtn = document.getElementById("submit");
const nextBtn = document.getElementById("next-button");
const prevBtn = document.getElementById("prev-button");
const resetBtn = document.getElementById("reset-button");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let x1, x2, y1, y2;

let width = 1200;
let height = 600;

canvas.height = height;
canvas.width = width;


let dy;
let dx;
let x = 0,
    y = 0;
let p = [];
let i = 1;
let timesNextCalled = 1;

submitBtn.addEventListener("click", () => {
    drawGrid();
});

nextBtn.addEventListener("click", () => {
    console.log("x,y,timesNextCalled="+x+","+y+","+timesNextCalled);
    if (timesNextCalled == 1) { // first time
        highlight(x, y, "green");
        highlight(x + 1, y, "yellow");
        highlight(x + 1, y + 1, "yellow");
        timesNextCalled++;
    } else if (timesNextCalled % 2 == 1 && (x < x2 || y < y2)) { // odd -> possibilities highlighted
        highlight(x + 1, y, "yellow");
        highlight(x + 1, y + 1, "yellow");
        timesNextCalled++;
    } else if (timesNextCalled % 2 == 0 && (x < x2 || y < y2)) { // even -> select one of the possibilities
        next();
        timesNextCalled++;
    }
    
});

prevBtn.addEventListener("click", () => {
    console.log("prev with timesNextCalled="+timesNextCalled);
    if (timesNextCalled >= 0) { 
        if(timesNextCalled == 1){
            highlight(x + 1, y,"black");
            highlight(x + 1, y + 1, "black");
            highlight(x, y, "black");
            timesNextCalled--;
        }   
        else if (timesNextCalled % 2 == 0) { //currently odd -> remove possibilities highloghting
            highlight(x + 1, y,"black");
            highlight(x + 1, y + 1, "black");

        
            timesNextCalled--;
        }
        else { //currently even -> remove current selection and go back to highlighting possible
            highlight(x, y, "yellow");
            if(p[i-2] < 0) {
                highlight(x , y+1, "yellow");
                x--;i--;
            }
            else {
                highlight(x , y-1, "yellow");
                x--; y--;i--;
            }
            timesNextCalled--;
        }
    }
 
});

resetBtn.addEventListener("click", () => {
    timesNextCalled = 1;
    x = 0;
    y = 0;
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    i = 1;
    p = [];
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function drawGrid() {

    x1 = parseInt(document.getElementById("x1").value);
    y1 = parseInt(document.getElementById("y1").value);

    x2 = parseInt(document.getElementById("x2").value);
    y2 = parseInt(document.getElementById("y2").value);

    swapCheck(x1, y1, x2, y2); // swap if x1 > x2

    x = x1;
    y = y1;
    dy = y2 - y1;
    dx = x2 - x1;
    p[0] = 2 * dy - dx;



    //height x height = 25x25 
    // -> 1 unit = height/25 units on grid
    ctx.beginPath();
    ctx.strokeStyle = "white";
    for (var i = 0; i <= height; i += (height / 25)) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
    }

    for (var i = 0; i <= width; i += (height / 25)) {
        ctx.moveTo(0, i);
        ctx.lineTo(height, i);
    }
    ctx.stroke();


    let X1 = (x1 - 0.5) * (height / 25);
    let Y1 = height - (y1 - 0.5) * (height / 25);
    let X2 = (x2 - 0.5) * (height / 25);
    let Y2 = height - (y2 - 0.5) * (height / 25);
    ctx.beginPath();
    ctx.arc(X1, Y1, 3, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(X2, Y2, 3, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.moveTo(X1, Y1);
    ctx.lineTo(X2, Y2);
    ctx.stroke();
}

function swapCheck(x1, y1, x2, y2) {
    if (x1 > x2) {
        let temp = x1;
        x1 = x2;
        x2 = temp;
        temp = y1;
        y1 = y2;
        y2 = temp;
        console.log(x1, y1, x2, y2);
    }

}

function next() {
    
    console.log("p[i-1]="+p[i-1]);
    
    if (p[i - 1] < 0) {
        p[i] = 2 * dy + p[i - 1];
        highlight(x + 1, y+1, "red");
        x = x + 1;
        y = y;
        highlight(x, y, "green");

    } else {
        highlight(x+1,y,"red");
        x = x + 1;
        y = y + 1;
        
        //highlight the grid
        highlight(x, y, "green");
        p[i] = 2 * dy + p[i - 1] - 2 * dx;

    }
    i++;
}

function highlight(a, b, color) {

    let X = (a - 0.5) * (height / 25);
    let Y = height - (b - 0.5) * (height / 25);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(X, Y, (height / 50), (height / 50));
    ctx.fillRect(X, Y, -(height / 50), -(height / 50));
    ctx.fillRect(X, Y, -(height / 50), (height / 50));
    ctx.fillRect(X, Y, (height / 50), -(height / 50));
    ctx.stroke();

    if( color == "black"){
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(X- height/50, Y- height/50);
        ctx.lineTo(X+ height/50, Y- height/50);

        ctx.moveTo(X- height/50, Y- height/50);
        ctx.lineTo(X- height/50, Y+ height/50);

        ctx.moveTo(X- height/50, Y+ height/50);
        ctx.lineTo(X+ height/50, Y+ height/50);

        ctx.moveTo(X- height/50, Y+ height/50);
        ctx.lineTo(X- height/50, Y- height/50);

        ctx.moveTo(X+ height/50, Y+ height/50);
        ctx.lineTo(X+ height/50, Y- height/50);
        ctx.stroke();
    }

    let X1 = (x1 - 0.5) * (height / 25);
    let Y1 = height - (y1 - 0.5) * (height / 25);
    let X2 = (x2 - 0.5) * (height / 25);
    let Y2 = height - (y2 - 0.5) * (height / 25);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.moveTo(X1, Y1);
    ctx.lineTo(X2, Y2);
    ctx.stroke();
}

