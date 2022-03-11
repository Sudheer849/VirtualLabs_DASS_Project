import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
var checkboxes = [];
let three_d = document.getElementById("checkbox1");
let lock_vertices = document.getElementById("checkbox2");
let show_animation = document.getElementById("checkbox3");
let transform_axis = document.getElementById("checkbox4");
let xy_grid = document.getElementById("checkbox5");
let yz_grid = document.getElementById("checkbox6");
let xz_grid = document.getElementById("checkbox7");
var Model = document.getElementById("AddModal");
var Model1 = document.getElementById("ModelAdd");
var ModelAdd = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
var deletebutton = document.getElementById("deletebutton");
var slider = document.getElementById("slider");
slider.addEventListener("input", movePoint);
document.getElementById("slider").max =
  document.getElementById("finalx").value - 3;
document.getElementById("slider").min = 0;
slider.step =
  (document.getElementById("slider").max -
    document.getElementById("slider").min) /
  document.getElementById("frames").value;
let final_xcoordinate = document.getElementById("finalx").value;
let final_ycoordinate = document.getElementById("finaly").value;
let final_zcoordinate = document.getElementById("finalz").value;
let frames = document.getElementById("frames").value;
//slider.step = 2;
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
  arrowHelper = [];

function vertexShader() {
  return `varying vec3 vUv; 
    
                void main() {
                  vUv = position; 
    
                  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                  gl_Position = projectionMatrix * modelViewPosition; 
                }`;
}
function fragmentShader() {
  return `uniform vec3 colorA; 
                  uniform vec3 colorB; 
                  varying vec3 vUv;
    
                  void main() {
                gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
                  }`;
}

// Section of Checkboxes
// --------------------------------------------------------------------------------------------------
// 2D
three_d.addEventListener("click", () => {
  if (three_d.checked) {
    //
  } else {
    //
  }
});

// lock vertices

lock_vertices.addEventListener("click", () => {
  if (lock_vertices.checked) {
    lock = 1;
    //console.log("hello");
    orbit.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
  } else {
    lock = 0;
    console.log("hi");
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
show_animation.addEventListener("click", () => {
  if (checkboxes[2].checked) {
    //
  } else {
    //
  }
});
// Transformation
transform_axis.addEventListener("click", () => {
  if (transform_axis.checked) {
    //
  } else {
    //
  }
});

// XY Grid
xy_grid.addEventListener("click", () => {
  if (xy_grid.checked) {
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
yz_grid.addEventListener("click", () => {
  if (yz_grid.checked) {
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
xz_grid.addEventListener("click", () => {
  if (xz_grid.checked) {
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
const size = 50;
const divisions = 25;

// Add a camera

ModelAdd.onclick = function () {
  Model1.style.display = "block";
  document.querySelector(".buttonissecondary").addEventListener("click", () => {
    var xcoord = document.getElementById("x1").value;
    var ycoord = document.getElementById("y1").value;
    var zcoord = document.getElementById("z1").value;
    // alert(document.getElementById("hi").value);
    if (document.getElementById("hi").value == "Cube") {
      createCube(xcoord, ycoord, zcoord);
      // createCube(xcoord, ycoord, zcoord);
    }
    if (document.getElementById("hi").value == "Tetrahedron") {
      createTetrahedron(xcoord, ycoord, zcoord);
    }
    if (document.getElementById("hi").value == "Octahedron") {
      createOctahedron(xcoord, ycoord, zcoord);
    }
    if (document.getElementById("hi").value == "Dodecahedron") {
      createDodecahedron(xcoord, ycoord, zcoord);
    }
    scene.remove(dott[0]);
    con = 1;
    Model1.style.display = "none";
  });
};

/////////////////////////////////////////////////// 2D slider simulation
function movePoint(e) {
  var target = e.target ? e.target : e.srcElement;
  console.log(target.value);
  let ycoordinate =
    target.value * (document.getElementById("finaly").value - 3);
  ycoordinate = ycoordinate / target.max;
  let zcoordinate =
    target.value * (document.getElementById("finalz").value - 3);
  zcoordinate = zcoordinate / target.max;
  console.log(ycoordinate);
  dott[0].position.set(target.value, ycoordinate, zcoordinate);
  document.getElementById("quantityx").value =
    parseFloat(dott[0].position.x) + 3;
  document.getElementById("quantityy").value =
    parseFloat(dott[0].position.y) + 3;
  document.getElementById("quantityz").value =
    parseFloat(dott[0].position.z) + 3;
}

document.getElementById("finalx").onchange = function () {
  let new_value = document.getElementById("finalx").value; // new value
  let new_position =
    3 + (dott[0].position.x * (new_value - 3)) / (final_xcoordinate - 3);
  dott[0].position.set(
    new_position - 3,
    dott[0].position.y,
    dott[0].position.z
  );
  document.getElementById("quantityx").value =
    parseFloat(dott[0].position.x) + 3;
  document.getElementById("quantityy").value =
    parseFloat(dott[0].position.y) + 3;
  document.getElementById("quantityz").value =
    parseFloat(dott[0].position.z) + 3;
  final_xcoordinate = new_value;
  document.getElementById("slider").max =
    document.getElementById("finalx").value - 3;
  document.getElementById("slider").min = 0;
  slider.step =
    (document.getElementById("slider").max -
      document.getElementById("slider").min) /
    document.getElementById("frames").value;

  //document.getElementById("final_x").value = new_value
};
document.getElementById("finaly").onchange = function () {
  let new_value = document.getElementById("finaly").value; // new value
  let new_position =
    3 + (dott[0].position.y * (new_value - 3)) / (final_ycoordinate - 3);
  dott[0].position.set(
    dott[0].position.x,
    new_position - 3,
    dott[0].position.z
  );
  document.getElementById("quantityx").value =
    parseFloat(dott[0].position.x) + 3;
  document.getElementById("quantityy").value =
    parseFloat(dott[0].position.y) + 3;
  document.getElementById("quantityz").value =
    parseFloat(dott[0].position.z) + 3;
  final_ycoordinate = new_value;
  document.getElementById("slider").max =
    document.getElementById("finalx").value - 3;
  document.getElementById("slider").min = 0;
  slider.step =
    (document.getElementById("slider").max -
      document.getElementById("slider").min) /
    document.getElementById("frames").value;
  //document.getElementById("final_y").value = new_value
};
document.getElementById("finalz").onchange = function () {
  let new_value = document.getElementById("finalz").value; // new value
  let new_position =
    3 + (dott[0].position.z * (new_value - 3)) / (final_zcoordinate - 3);
  dott[0].position.set(
    dott[0].position.x,
    dott[0].position.y,
    new_position - 3
  );
  document.getElementById("quantityx").value =
    parseFloat(dott[0].position.x) + 3;
  document.getElementById("quantityy").value =
    parseFloat(dott[0].position.y) + 3;
  document.getElementById("quantityz").value =
    parseFloat(dott[0].position.z) + 3;
  final_zcoordinate = new_value;
  document.getElementById("slider").max =
    document.getElementById("finalx").value - 3;
  document.getElementById("slider").min = 0;
  slider.step =
    (document.getElementById("slider").max -
      document.getElementById("slider").min) /
    document.getElementById("frames").value;
  //document.getElementById("final_z").value = new_value
};
document.getElementById("frames").onchange = function () {
  let new_value = document.getElementById("frames").value; // new value
  let new_xcoord = 3 + (dott[0].position.x * frames) / new_value;
  let new_ycoord = 3 + (dott[0].position.y * frames) / new_value;
  let new_zcoord = 3 + (dott[0].position.z * frames) / new_value;
  console.log(new_xcoord, new_ycoord, new_zcoord);
  dott[0].position.set(new_xcoord - 3, new_ycoord - 3, new_zcoord - 3);
  slider.step =
    (document.getElementById("slider").max -
      document.getElementById("slider").min) /
    document.getElementById("frames").value;
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
var dott = [];
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
    Model.style.display = "block";
    deletebutton.addEventListener("click", () => {
      for (let i = 0; i < intersects.length; i++) {
        scene.remove(intersects[i].object);
      }
      var PointGeometry = Dot();
      con = 0;
      Model.style.display = "none";
    });
    document.querySelector(".buttonisprimary").addEventListener("click", () => {
      for (let i = 0; i < intersects.length; i++) {
        scene.remove(intersects[i].object);
      }
      var xcoord = document.getElementById("x").value;
      var ycoord = document.getElementById("y").value;
      var zcoord = document.getElementById("z").value;
      // alert(document.querySelector("select").value);
      if (document.querySelector("select").value == "Cube") {
        createCube(xcoord, ycoord, zcoord);
        // createCube(xcoord, ycoord, zcoord);
      }
      if (document.querySelector("select").value == "Tetrahedron") {
        createTetrahedron(xcoord, ycoord, zcoord);
      }
      if (document.querySelector("select").value == "Octahedron") {
        createOctahedron(xcoord, ycoord, zcoord);
      }
      if (document.querySelector("select").value == "Dodecahedron") {
        createDodecahedron(xcoord, ycoord, zcoord);
      }
      Model.style.display = "none";
    });
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
      point[i * 8].position.set(
        planeIntersect.x + shift.x - dragx[0],
        planeIntersect.y + shift.y - dragy[0],
        planeIntersect.z + shift.z - dragz[0]
      );
    }
  } else if (isDragging && con == 0) {
    raycaster.ray.intersectPlane(plane, planeIntersect);
    //  dot.geometry.verticesNeedUpdate = true;
    /*  dott[0].position.set(
      planeIntersect.x + shift.x,
      planeIntersect.y + shift.y,
      planeIntersect.z + shift.z
    );*/
    orbit.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    // orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
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
        shift.subVectors(dott[0].position, planeIntersect);
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

// Cube Function
// --------------------------------------------------------------------------------------------------

let createCube = function (x, y, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  shapes.push(cub);
  shapes[shapes.length - 1].position.set(x, y, z);
  scene.add(shapes[shapes.length - 1]);
  // console.log(cube[cube.length - 1]);
  var vertex = new THREE.Vector3();
  // console.log(cube[cube.length - 1].geometry.vertices[0]);
  for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
    var dotMaterial = new THREE.PointsMaterial({
      color: "white",
      size: 6,
      sizeAttenuation: false,
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
document.querySelector(".submit_button").addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dott[0].position.set(x - xcor, y - ycor, z - zcor);
});
// Dodecahedron Function
// --------------------------------------------------------------------------------------------------
let createDodecahedron = function (x, y, z) {
  const geometry = new THREE.DodecahedronGeometry(1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  shapes.push(cub);
  shapes[shapes.length - 1].position.set(x, y, z);
  scene.add(shapes[shapes.length - 1]);
  // console.log(cube[cube.length - 1]);
  var vertex = new THREE.Vector3();
  // console.log(cube[cube.length - 1].geometry.vertices[0]);
  for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
    var dotMaterial = new THREE.PointsMaterial({
      color: "white",
      size: 6,
      sizeAttenuation: false,
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

// Octahedron Function
// --------------------------------------------------------------------------------------------------
let createOctahedron = function (x, y, z) {
  const geometry = new THREE.OctahedronGeometry(1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  shapes.push(cub);
  shapes[shapes.length - 1].position.set(x, y, z);
  scene.add(shapes[shapes.length - 1]);
  // console.log(cube[cube.length - 1]);
  var vertex = new THREE.Vector3();
  // console.log(cube[cube.length - 1].geometry.vertices[0]);
  for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
    var dotMaterial = new THREE.PointsMaterial({
      color: "white",
      size: 6,
      sizeAttenuation: false,
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
// Tetrahedron Function
// --------------------------------------------------------------------------------------------------
let createTetrahedron = function (x, y, z) {
  const geometry = new THREE.TetrahedronGeometry(1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  shapes.push(cub);
  shapes[shapes.length - 1].position.set(x, y, z);
  scene.add(shapes[shapes.length - 1]);

  // console.log(cube[cube.length - 1]);
  var vertex = new THREE.Vector3();
  // console.log(cube[cube.length - 1].geometry.vertices[0]);
  for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
    var dotMaterial = new THREE.PointsMaterial({
      color: "white",
      size: 6,
      sizeAttenuation: false,
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

document.querySelector(".submit_button").addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dott[0].position.set(x - xcor, y - ycor, z - zcor);
});
document.querySelector(".submit_button").addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dott[0].position.set(x - xcor, y - ycor, z - zcor);
});

// Dot Function
// --------------------------------------------------------------------------------------------------

let Dot = function () {
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(new THREE.Vector3(xcor, ycor, zcor));
  var dotMaterial = new THREE.PointsMaterial({
    size: 6,
    sizeAttenuation: false,
  });
  var point = new THREE.Points(dotGeometry, dotMaterial);
  dott.push(point);
  scene.add(dott[0]);
  console.log(dotGeometry.vertices[0]);
  return dotGeometry;
};

// Function for Lights

function createLights() {
  // Create a directional light
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 9);
  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  scene.add(ambientLight);

  // move the light back and up a bit
  mainLight.position.set(10, 10, 10);

  // remember to add the light to the scene
  scene.add(ambientLight, mainLight);
}

scene = new THREE.Scene();
scene.background = new THREE.Color(0x36393e);
camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
// Materials Function

function createMaterials() {
  const cubeShader = new THREE.ShaderMaterial({
    uniforms: {
      colorA: { type: "vec3", value: new THREE.Color(0xff0000) },
      colorB: { type: "vec3", value: new THREE.Color(0x0000ff) },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  });

  return {
    cubeShader,
  };
}
// Geometries Function
function createGeometries() {
  const cube = new THREE.BoxGeometry(1, 1, 1);
  return {
    cube,
  };
}
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
  var PointGeometry = Dot();
  renderer = new THREE.WebGLRenderer();
  var container = document.getElementById("hello");
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

