import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(0, 20, 30);//from  w  w w . de mo 2s .c  om
var scene = new THREE.Scene();
var light = new THREE.PointLight();
light.position.set(0, 20, 50);
scene.add(light);
var renderer = renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement); // comment this line and uncomment the next one to see the difference in the behaviour of the slider
//var controls = new THREE.OrbitControls(camera);
var slider = document.getElementById("slider");
slider.addEventListener("input", moveCube);
var geometry = new THREE.BoxGeometry(1,1,1);
var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
scene.add(mesh);
var plane = new THREE.GridHelper(20, 40);
scene.add(plane);
function moveCube(e){
   var target = (e.target) ? e.target : e.srcElement;
  mesh.position.x = target.value;
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();