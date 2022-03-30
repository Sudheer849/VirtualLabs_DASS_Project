import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";


export let Dot = function(scene, dot_list, xcor, ycor, zcor) {
    let dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(xcor, ycor, zcor));
    let dotMaterial = new THREE.PointsMaterial({
        size: 6,
        sizeAttenuation: false,
    });
    let point = new THREE.Points(dotGeometry, dotMaterial);
    dot_list.push(point);
    scene.add(dot_list[0]);
    return dotGeometry;
};
