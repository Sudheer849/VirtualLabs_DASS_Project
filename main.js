import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
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
var Model1 = document.getElementById("ModelAdd");
var ModelAdd = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
var deletebutton = document.getElementById("deletebutton");
var scene;
var camera;
var renderer;
var orbit;
var shapes = [],
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
  arrowHelper = [];

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
checkboxes[0].addEventListener("click", () => {
  if (checkboxes[0].checked) {
    //
  } else {
    //
  }
});

// lock vertices

checkboxes[1].addEventListener("click", () => {
  if (checkboxes[1].checked) {
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
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 1, 0);
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
// buttons[0].addEventListener("click", XY, false);
// buttons[1].addEventListener("click", XZ, false); //
// buttons[2].addEventListener("click", YZ, false);
buttons[0].addEventListener("click", Change, false);
// buttons[4].addEventListener("click", Rotate, false);
// buttons[5].addEventListener("click", Delete, false);
// buttons[6].addEventListener("click", Add, false);
//buttons[7].addEventListener("click", ADD, false);
// buttons[8].addEventListener("click", lockV, false);
buttons[1].addEventListener("click", NewCam, false);
buttons[2].addEventListener("click", OldCam, false);
const size = 50;
const divisions = 25;

var camera2, scene2, controls;
function AddCam ( near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp ) {
  // 1 == orthographic, 0 == perspective
  scene.remove(camera);
  if (ortho_persp == 1) {
    camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  } else {
    // cam2 = new THREE.PerspectiveCamera( Math.atan( ( (top - bottom)/( near + far ) ), (left - right) / (top - bottom) , near, far) );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, near, far );
    camera.up.set(up_vec.x, up_vec.y, up_vec.z);
  }
  
  camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
  camera.lookAt(target);

  scene.add(camera);
  // renderer.render(scene, camera);

  // let newRenderer = new THREE.WebGLRenderer();
  // newRenderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(newRenderer.domElement);

  // orbit controls
  // if (ortho_persp == 0) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
      // LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.target.set(target.x, target.y, target.z);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05; 
    orbit.minPolarAngle = 0;
    orbit.maxPolarAngle = 180;

    controls.update();  
  // }
  return camera;
}

function NewCam(event) {
  // function AddCam ( near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp ) {
  // AddCam(0.1, 1000, -10, -10, -10, 10, new THREE.Vector3(7,-6,2), new THREE.Vector3(1,1,1), new THREE.Vector3(1,0,1), 0);
  AddCam(0.01, 100, -3.2, 3.2, -2.4, 2.4, new THREE.Vector3(3,5,2), new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 1);

}

document.getElementById("new-cam").onclick = function (){
  // function AddCam ( near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp ) {
  // AddCam(0.1, 1000, -10, -10, -10, 10, new THREE.Vector3(7,-6,2), new THREE.Vector3(1,1,1), new THREE.Vector3(1,0,1), 0);
  // AddCam(0.01, 100, -3.2, 3.2, -2.4, 2.4, new THREE.Vector3(3,5,2), new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 1);

  let near = document.getElementById("near-coord").value;
  let far = document.getElementById("far-coord").value;
  let left = document.getElementById("left-coord").value;
  let right = document.getElementById("right-coord").value;
  let bottom = document.getElementById("bottom-coord").value;
  let top = document.getElementById("top-coord").value;

  let camera_pos = new THREE.Vector3(document.getElementById("cam-x").value, document.getElementById("cam-y").value, document.getElementById("cam-z").value);
  let target = new THREE.Vector3(document.getElementById("target-x").value, document.getElementById("target-y").value, document.getElementById("target-z").value);
  let up_vec = new THREE.Vector3(document.getElementById("up-x").value, document.getElementById("up-y").value, document.getElementById("up-z").value);
  let ortho_persp = document.getElementById("ortho-id").value;

  // debug
  console.log(near, far, left, right, top, bottom, camera_pos, target, up_vec, parseInt(ortho_persp));

  AddCam(parseFloat(near), parseFloat(far), parseFloat(left), parseFloat(right), parseFloat(top), parseFloat(bottom), camera_pos, target, up_vec, 1 );
}

// Add a camera 
function OldCam () {
  scene.remove(camera);
  
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 5;

  origin = new THREE.Vector3(0, 0, 0);
  camera.lookAt(origin);

  scene.add(camera);
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.mouseButtons = {
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.ROTATE,
  };
  orbit.target.set(0, 0, 0);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.05;

  renderer.render(scene, camera);

  return camera;
}

function XY(event) {
  let grid = new THREE.GridHelper(size, divisions);
  let vector3 = new THREE.Vector3(0, 0, 1);
  grid.lookAt(vector3);
  if (vargrid1 == 0) {
    grid1.push(grid);
    scene.add(grid1[0]);
    vargrid1 = 1;
  } else {
    scene.remove(grid1[0]);
    grid1.pop();
    vargrid1 = 0;
  }
}

function XZ(event) {
  let grid = new THREE.GridHelper(size, divisions);
  let vector3 = new THREE.Vector3(0, 1, 0);
  grid.lookAt(vector3);
  if (vargrid2 == 0) {
    grid2.push(grid);
    scene.add(grid2[0]);
    vargrid2 = 1;
  } else {
    scene.remove(grid2[0]);
    grid2.pop();
    vargrid2 = 0;
  }
}
function YZ(event) {
  let grid = new THREE.GridHelper(size, divisions);
  grid.geometry.rotateZ(Math.PI / 2);
  if (vargrid3 == 0) {
    grid3.push(grid);
    scene.add(grid3[0]);
    vargrid3 = 1;
  } else {
    scene.remove(grid3[0]);
    vargrid3 = 0;
  }
}
function Change(event) {
  // scene.remove(arrowHelper2);
  // scene.remove(arrowHelper5);
  is_2D = 1;

  camera_pos = new THREE.Vector3(3, 0, 0);
  camera_up = new THREE.Vector3(0, 0, 1);
  camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
  camera.up.set(0, 1, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  orbit.screenSpacePanning = true;

  if( first_time == 1 ) {
    //create someplane to project to
    two_plane = new THREE.Plane().setFromCoplanarPoints( new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0) );
    //create some geometry to flatten..
    // two_geometry = new THREE.BufferGeometry();
    // fillGeometry(two_geometry);
    first_time = 0;
  }

  var positionAttr = two_geometry.getAttribute("position");
  for(var i = 0; i < positionAttr.array.length; i+=3)
  {
      var point = new THREE.Vector3(positionAttr.array[i],positionAttr.array[i+1],positionAttr.array[i+2]);
      var projectedPoint = two_plane.projectPoint();
      positionAttr.array[i] = projectedPoint.x;
      positionAttr.array[i+1] = projectedPoint.y;
      positionAttr.array[i+2] = projectedPoint.z;
  }
  positionAttr.needsUpdate = true;
  
  // orbit.minPolarAngle = 0;
  // orbit.maxPolarAngle = 0;
}

function Delete(event) {
  scene.remove(shapes[shapes.length - 1]);
  shapes.pop();
  var PointGeometry = Dot();
  con = 0;
}

// locks the vertices of the shape
function lockV(event) {
  if( cube[cube.length-1].geometry.verticesNeedUpdate == true )
      cube[cube.length - 1].geometry.verticesNeedUpdate = false;
  else
      cube[cube.length - 1].geometry.verticesNeedUpdate = true;
} 

function Add(event) {
  createCube(0, 0, 0);
  scene.remove(dott[0]);
  con = 1;
}

function Rotate(event) {
  if (variable == 0) {
    variable = 1;
  } else {
    variable = 0;
  }
  console.log(variable);
}

document.getElementById("myBtn").onclick = function () {
  Model1.style.display = "block";
  modelbutton2.addEventListener("click", () => {
    var xcoord = document.getElementById("x1").value;
    var ycoord = document.getElementById("y1").value;
    var zcoord = document.getElementById("z1").value;
    // alert(document.getElementById("hi").value);
    no_of_shapes++;
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
var dott = [];
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
        scene.add(dott[0]);
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
    dott[0].position.set(
      planeIntersect.x + shift.x,
      planeIntersect.y + shift.y,
      planeIntersect.z + shift.z
    );
    scale = document.getElementById("h-s").value;
    let c_x = document.getElementById("quantityx").value = ((dott[0].position.x + xcor)*scale).toFixed(2);
    let c_y = document.getElementById("quantityy").value = ((dott[0].position.y + ycor)*scale).toFixed(2);
    let c_z = document.getElementById("quantityz").value = ((dott[0].position.z + zcor)*scale).toFixed(2);
      
    let h_x = c_x*scale;
    let h_y = c_y*scale;
    let h_z = c_z*scale;

    document.getElementById("h-x").value = h_x.toFixed(2);
    document.getElementById("h-y").value = h_y.toFixed(2);
    document.getElementById("h-z").value = h_z.toFixed(2);
  }
});
document.getElementById("h-s").onchange = function () {
  scale = parseFloat(document.getElementById("h-s").value) ;
  // alert(scale);
  document.getElementById("h-x").value = ( parseFloat(document.getElementById("quantityx").value) * scale).toFixed(2);    
  document.getElementById("h-y").value = ( parseFloat(document.getElementById("quantityy").value) * scale).toFixed(2);
  document.getElementById("h-z").value = ( parseFloat(document.getElementById("quantityz").value) * scale).toFixed(2);

};
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
    const geometry = new THREE.SphereGeometry(15, 32, 16);
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
    if (i === 0) {
      shapevertex.push(dot);
    }
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
button.addEventListener("click", () => {
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
    if (i === 0) {
      shapevertex.push(dot);
    }
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
    if (i === 0) {
      shapevertex.push(dot);
    }
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
    if (i === 0) {
      shapevertex.push(dot);
    }
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

button.addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dott[0].position.set(x - xcor, y - ycor, z - zcor);
});
button.addEventListener("click", () => {
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
      colorA: { type: "vec3", value: new THREE.Color(0x00FF00) },
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
