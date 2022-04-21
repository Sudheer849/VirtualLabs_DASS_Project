"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

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


export function createMaterials() {
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
