import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Matrix4 } from 'three';

console.log('begin of js') 

function STLViewer(model, elementID, color) {
    console.log('STLViewer function called');
    var elem = document.getElementById(elementID)
    console.log('Element found:', elem);

    var camera = new THREE.PerspectiveCamera(100, elem.clientWidth/elem.clientHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.appendChild(renderer.domElement);
    window.addEventListener('resize', function () {
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    camera.aspect = elem.clientWidth/elem.clientHeight;
    camera.updateProjectionMatrix();
    }, false);

    var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.rotateSpeed = 0.05;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = .75;
    var scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 1.5));
    (new STLLoader()).load(model, function (geometry) {
    console.log('Geometry object:', geometry);
    console.log('Model loaded successfully:', geometry);
    var material = new THREE.MeshPhongMaterial({ 
        color: color, 
        specular: 100, 
        shininess: 100});
    var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    var middle = new THREE.Vector3();
    geometry.computeBoundingBox();
    geometry.boundingBox.getCenter(middle);

    var translationMatrix = new Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z);
    geometry.applyMatrix4(translationMatrix);

    var largestDimension = Math.max(geometry.boundingBox.max.x,
                                    geometry.boundingBox.max.y, 
                                    geometry.boundingBox.max.z)
    camera.position.z = largestDimension * 1.0;
    camera.position.y = largestDimension * 0.9;
    camera.position.x = largestDimension * 0.9;
    var animate = function () {
        requestAnimationFrame(animate);
            controls.update();
        renderer.render(scene, camera);
    }; 
    animate();            
    })
}

window.STLViewer = STLViewer;


console.log('Script loaded');