import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";

// importing internal files
// import { createMaterials } from "./exp1/materials.js";
import { AddCam, OldCam } from "./js/camera.js";
import { createCube, createDodecahedron, createOctahedron, createTetrahedron } from "./js/shapes.js";
import { ProjectTo2D } from "./js/2dprojection.js";
import { Dot } from "./js/point.js";

const button = document.querySelector(".submit_button");
const modelbutton1 = document.querySelector(".buttonisprimary");
const modelbutton2 = document.querySelector(".buttonissecondary");
var checkboxes = [];
checkboxes[0] = document.getElementById("checkbox1");
checkboxes[1] = document.getElementById("checkbox2");
checkboxes[2] = document.getElementById("checkbox3");
checkboxes[3] = document.getElementById("checkbox4");
checkboxes[4] = document.getElementById("checkbox5");
checkboxes[5] = document.getElementById("checkbox6");
checkboxes[6] = document.getElementById("checkbox7");
var Model = document.getElementById("AddModal");
var Model1 = document.getElementById("ModelEdit");
var ModelAdd = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
var deletebutton = document.getElementById("deletebutton");
let scene,
  camera,
  renderer,
  orbit,
  shapes = [],
  rot = 0.01,
  variable = 0,
  con = 0,
  vargrid1 = 0,
  vargrid2 = 0,
  vargrid3 = 0,
  grid1 = [],
  grid2 = [],
  grid3 = [],
  dragx = [],
  dragy = [],
  dragz = [],
  xcor = 3,
  ycor = 3,
  zcor = 3,
  lock = 0,
  dir = [],
  scale = 1,
  two_plane,
  two_geometry,
  first_time = 1,
  is_2D = 0,
  arrowHelper = [];


// Get the modal
var Addmodal = document.getElementById("AddModal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  Addmodal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == Addmodal) {
    Addmodal.style.display = "none";
  }
}

// modal box for camera js part
let CamModal = document.getElementById("CamModal");
let camBtn = document.getElementById("NewCam");

let span4 = document.getElementsByClassName("close")[4];

camBtn.onclick = function() {
  CamModal.style.display = "block";
}

span4.onclick = function() {
  CamModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == CamModal) {
    CamModal.style.display = "none";
  }
}

// Section of Checkboxes
// --------------------------------------------------------------------------------------------------
// 2D
checkboxes[0].addEventListener("click", () => {
  if (checkboxes[0].checked) {
    ProjectTo2D( camera, orbit, is_2D, two_plane, first_time, two_geometry );
  } 
});

// lock vertices
checkboxes[1].addEventListener("click", () => {
  if (checkboxes[1].checked) {
    lock = 1;
    orbit.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
  } else {
    lock = 0;
    orbit.mouseButtons = {
      //  LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
    //
  }
});
//Show Animation
checkboxes[2].addEventListener("click", () => {
  if (checkboxes[2].checked) {
    //
  } else {
    //
  }
});
// Transformation
checkboxes[3].addEventListener("click", () => {
  if (checkboxes[3].checked) {
    //
  } else {
    //
  }
});

// XY Grid
checkboxes[4].addEventListener("click", () => {
  if (checkboxes[4].checked) {
    var grid = new THREE.GridHelper(size, divisions);
    var vector3 = new THREE.Vector3(0, 0, 1);
    grid.lookAt(vector3);
    grid1.push(grid);
    scene.add(grid1[0]);
  } //
  else {
    scene.remove(grid1[0]);
    grid1.pop();
  }
});
// XZ Grid
checkboxes[5].addEventListener("click", () => {
  if (checkboxes[5].checked) {
    var grid = new THREE.GridHelper(size, divisions);
    grid.geometry.rotateZ(Math.PI / 2);
    grid3.push(grid);
    scene.add(grid3[0]);
  } else {
    scene.remove(grid3[0]);
    grid3.pop();
    //
  }
});
// YZ Grid
checkboxes[6].addEventListener("click", () => {
  if (checkboxes[6].checked) {
    var grid = new THREE.GridHelper(size, divisions);
    var vector3 = new THREE.Vector3(0, 1, 0);
    grid.lookAt(vector3);
    grid2.push(grid);
    scene.add(grid2[0]);
  } else {
    scene.remove(grid2[0]);
    grid2.pop();
    //
  }
});

// Section of Buttons
// --------------------------------------------------------------------------------------------------

var buttons = document.getElementsByTagName("button");
const size = 50;
const divisions = 25;

let camera2, scene2, controls;

function NewCam(event) {
  // function AddCam ( near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp ) {
  // AddCam(0.1, 1000, -10, -10, -10, 10, new THREE.Vector3(7,-6,2), new THREE.Vector3(1,1,1), new THREE.Vector3(1,0,1), 0);
  AddCam(0.01, 100, -3.2, 3.2, -2.4, 2.4, new THREE.Vector3(3,5,2), new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 1, scene, camera, controls, renderer);

}

document.getElementById("new-cam").onclick = function (){

  let near = document.getElementById("near-coord").value;
  let far = document.getElementById("far-coord").value;
  let left = document.getElementById("left-coord").value;
  let right = document.getElementById("right-coord").value;
  let bottom = document.getElementById("bottom-coord").value;
  let top = document.getElementById("top-coord").value;

  let camera_pos = new THREE.Vector3(document.getElementById("cam-x").value, document.getElementById("cam-y").value, document.getElementById("cam-z").value);
  let target = new THREE.Vector3(document.getElementById("target-x").value, document.getElementById("target-y").value, document.getElementById("target-z").value);
  let up_vec = new THREE.Vector3(document.getElementById("up-x").value, document.getElementById("up-y").value, document.getElementById("up-z").value);
  let ortho_persp = document.getElementById("camera-type").value;

  AddCam(near, far, left, right, bottom, top, camera_pos, target, up_vec, parseInt(ortho_persp), scene, camera, controls, renderer );
}

document.getElementById("myBtn").onclick = function () {
  Model.style.display = "block";
  modelbutton2.addEventListener("click", () => {
    var xcoord = document.getElementById("x1").value;
    var ycoord = document.getElementById("y1").value;
    var zcoord = document.getElementById("z1").value;
    // alert(document.getElementById("hi").value);
    no_of_shapes++;
    if (document.getElementById("hi").value == "Cube") {
      createCube(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
    }
    if (document.getElementById("hi").value == "Tetrahedron") {
      createTetrahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
    }
    if (document.getElementById("hi").value == "Octahedron") {
      createOctahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
    }
    if (document.getElementById("hi").value == "Dodecahedron") {
      createDodecahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
    }
    scene.remove(dot_list[0]);
    con = 1;
    Mode.style.display = "none";
  });
};

// Section of mouse control functions
// --------------------------------------------------------------------------------------------------

var raycaster = new THREE.Raycaster();
var raycaster1 = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;
var point = [];
var shapevertex = [];
var dot_list = [];
var no_of_shapes = 0;
function SelectShape(e) {
  document.getElementById("Add-shape").value = e.target.value;
}

document.addEventListener("dblclick", ondblclick, false);
// double click
function ondblclick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster1.setFromCamera(mouse, camera);
  var intersects = raycaster1.intersectObjects(shapes);
  if (intersects.length > 0) {
    console.log(
      intersects[0].object.position.x,
      intersects[0].object.position.y,
      intersects[0].object.position.z
    );
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    line.position.set(
      intersects[0].object.position.x,
      intersects[0].object.position.y,
      intersects[0].object.position.z
    );
    scene.add(line);
    document.getElementById("deleteShape").onclick = function () {
      console.log("Hi");
      scene.remove(line);
      for (let i = 0; i < intersects.length; i++) {
        scene.remove(intersects[i].object);
        no_of_shapes--;
        console.log(no_of_shapes);
      }
      if (no_of_shapes == 0) {
        con = 0;
        scene.add(dot_list[0]);
      }
    };
    // geometry.translate(intersects[0].object.position.x,intersects[0].object.position.y,intersects[0].object.position.z);
    document.getElementById("editShape").onclick = function () {
      document.getElementById("AddModal").style.display = "block";
      document
        .querySelector(".buttonisprimary")
        .addEventListener("click", () => {
          for (let i = 0; i < intersects.length; i++) {
            scene.remove(intersects[i].object);
            scene.remove(line);
          }
          var xcoord = document.getElementById("x").value;
          var ycoord = document.getElementById("y").value;
          var zcoord = document.getElementById("z").value;
          // alert(document.querySelector("select").value);
          no_of_shapes++;
          if (document.querySelector("select").value == "Cube") {
            createCube(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
          }
          if (document.querySelector("select").value == "Tetrahedron") {
            createTetrahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
          }
          if (document.querySelector("select").value == "Octahedron") {
            createOctahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
          }
          if (document.querySelector("select").value == "Dodecahedron") {
            createDodecahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
          }
          document.getElementById("AddModal").style.display = "none";
        });
    };
  }
}

span.onclick = function () {
  Model.style.display = "none";
};
// mouse drag

document.addEventListener("pointermove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  if (isDragging && con == 1 && lock == 0) {
    for (let i = 0; i < shapes.length; i++) {
      raycaster.ray.intersectPlane(plane, planeIntersect);
      shapes[i].geometry.vertices[0].set(
        planeIntersect.x + shift.x,
        planeIntersect.y + shift.y,
        planeIntersect.z + shift.z
      );
      shapes[i].geometry.verticesNeedUpdate = true;
      shapevertex[i].position.set(
        planeIntersect.x + shift.x - dragx[i],
        planeIntersect.y + shift.y - dragy[i],
        planeIntersect.z + shift.z - dragz[i]
      );
    }
  } else if (isDragging && con == 0) {
    raycaster.ray.intersectPlane(plane, planeIntersect);
    //  dot.geometry.verticesNeedUpdate = true;
    dot_list[0].position.set(
      planeIntersect.x + shift.x,
      planeIntersect.y + shift.y,
      planeIntersect.z + shift.z
    );
    scale = document.getElementById("h-s").value;
    let c_x = document.getElementById("quantityx").value = ((dot_list[0].position.x + xcor)*scale).toFixed(2);
    let c_y = document.getElementById("quantityy").value = ((dot_list[0].position.y + ycor)*scale).toFixed(2);
    let c_z = document.getElementById("quantityz").value = ((dot_list[0].position.z + zcor)*scale).toFixed(2);
      
    let h_x = c_x*scale;
    let h_y = c_y*scale;
    let h_z = c_z*scale;

    document.getElementById("h-x").value = h_x.toFixed(2);
    document.getElementById("h-y").value = h_y.toFixed(2);
    document.getElementById("h-z").value = h_z.toFixed(2);
  }
});

// mouse click

document.addEventListener("pointerdown", () => {
  switch (event.which) {
    case 1:
      //  Left mouse button pressed
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      pNormal.copy(camera.position).normalize();
      plane.setFromNormalAndCoplanarPoint(pNormal, scene.position);
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, planeIntersect);
      if (con == 1) {
        shift.subVectors(point[0].position, planeIntersect);
      } else {
        shift.subVectors(dot_list[0].position, planeIntersect);
      }
      isDragging = true;
      dragObject = shapes[shapes.length - 1];
      break;
  }
});
// mouse release

document.addEventListener("pointerup", () => {
  isDragging = false;
  dragObject = null;
});

button.addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dot_list[0].position.set(x - xcor, y - ycor, z - zcor);
});
button.addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dot_list[0].position.set(x - xcor, y - ycor, z - zcor);
});

scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);
camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000);

// Main Function
// --------------------------------------------------------------------------------------------------

let init = function () {
  camera.position.z = 5;
  camera.position.x = 2;
  camera.position.y = 2;
  const gridHelper = new THREE.GridHelper(size, divisions);
  const count = 1;
  dir[0] = new THREE.Vector3(1, 0, 0);
  dir[1] = new THREE.Vector3(0, 1, 0);
  dir[2] = new THREE.Vector3(0, 0, 1);
  dir[3] = new THREE.Vector3(-1, 0, 0);
  dir[4] = new THREE.Vector3(0, -1, 0);
  dir[5] = new THREE.Vector3(0, 0, -1);
  //dir1.normalize();

  const origin = new THREE.Vector3(0, 0, 0);
  const length = 10;
  arrowHelper[0] = new THREE.ArrowHelper(dir[0], origin, length, "red");
  arrowHelper[1] = new THREE.ArrowHelper(dir[1], origin, length, "yellow");
  arrowHelper[2] = new THREE.ArrowHelper(dir[2], origin, length, "blue");
  arrowHelper[3] = new THREE.ArrowHelper(dir[3], origin, length, "red");
  arrowHelper[4] = new THREE.ArrowHelper(dir[4], origin, length, "yellow");
  arrowHelper[5] = new THREE.ArrowHelper(dir[5], origin, length, "blue");
  for (let i = 0; i < 6; i++) {
    scene.add(arrowHelper[i]);
  }
  var PointGeometry = Dot( scene, dot_list, xcor, ycor, zcor );
  renderer = new THREE.WebGLRenderer();
  var container = document.getElementById("canvas-main");
  var w = container.offsetWidth;
  var h = container.offsetHeight;
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.mouseButtons = {
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.ROTATE,
  };
  orbit.target.set(0, 0, 0);
  orbit.enableDamping = true;

  // OldCam(scene, camera, orbit, renderer);
};
let mainLoop = function () {
  //console.log(scene.children);
  if (variable == 1) {
    for (let cub of cube) {
      cub.rotation.y += rot;
      if (cub.position.x <= -3 || cub.position.x >= 3) rot *= -1;
    }
  }

  // orbit.update();
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};
init();
mainLoop();
