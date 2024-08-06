import * as THREE from 'three';
import { PointerLockControls } from 'three-stdlib';

// Scene
const scene = new THREE.Scene(); // create the scene

// Camera
const camera  = new THREE.PerspectiveCamera(
    75, //field of view
    window.innerWidth / window.innerHeight, //Aspect Ratio
    0.1, //near
    1000 //far
);
scene.add(camera);
camera.position.z = 5; // move the camera back 5 units


// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true}); // for smooth edges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffff, 1); // background color
document.body.appendChild(renderer.domElement); // add tge renderer to our html

// Let there be Light!
// ambient light
const ambientLight = new THREE.AmbientLight(0x101010, 1.0); // color, intensity, distance, decay
scene.add(ambientLight);

// Directional Light
const sunLight = new THREE.DirectionalLight(0xddddd, 1.0); // color, intensity
sunLight.position.y = 15;
scene.add(sunLight);
 
const geometry = new THREE.BoxGeometry(1, 1, 1); // BoxGeometry is the shape of the object
let material = new THREE.MeshBasicMaterial({ color: 'blue' }); // color of the object
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);// add cube to scene

// Controls
// Event Listenet for whn we press the key
document.addEventListener("keydown", onKeyDown, false);

//  Texture of the floor
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('img/Flooring1.png');

// Create the floor plane. 
const planeGeometry = new THREE.PlaneGeometry(50, 50) //BoxGeometry is the shape of the object
const planeMaterial = new THREE.MeshBasicMaterial({
    // color: "green",
    map: floorTexture,
    side: THREE.DoubleSide,
});

let floorPlane = new THREE.Mesh(planeGeometry,  planeMaterial);

floorPlane.rotation.x = Math.PI / 2 ; //THis is 90 degree rotation
floorPlane.position.y = -Math.PI ; // This is 180 degree rotation

scene.add(floorPlane);

// Create the walls
const wallGroup = new THREE.Group(); // create a group to hold the walls
scene.add(wallGroup);

// Front wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshBasicMaterial({ color: 'lightgreen' })
);

frontWall.position.z = -20;

// Left wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20 , 0.001),
    new THREE.MeshBasicMaterial({
        color: 'red',
    })
);

leftWall.rotation.y = Math.PI / 2; // this is 90 degrees
leftWall.position.x = -20;

// Right wall
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshBasicMaterial({
        color: 'yellow',
    })
);

rightWall.rotation.y = Math.PI / 2; // this is 90 degrees
rightWall.position.x =  20;

wallGroup.add(frontWall, leftWall, rightWall);

// Loop through each wall and create the bonding box
for (let i = 0; i < wallGroup.children.length; i++) {
    wallGroup.children[i].BBox = new THREE.Box3();
    wallGroup.children[i].BBox.setFromObject(wallGroup.children[i]);
}

// Create the ceiling
const ceilingGeometry = new THREE.PlaneGeometry(50, 50); // BoxGeometry is the shape of the object
const ceilingMaterial = new THREE.MeshBasicMaterial({
    color: 'blue'
});
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

ceilingPlane.rotation.x = Math.PI / 2;
ceilingPlane.position.y = 12;

scene.add(ceilingPlane);

function createPainting(imageURL, width, height, position) {
    // ...
    const textureLoader = new THREE.TextureLoader();
    const paintingTexture = textureLoader.load(imageURL);
    const paintingMaterial = new THREE.MeshBasicMaterial({
        map: paintingTexture,
    });
    const paintingGeometry = new THREE.PlaneGeometry(width, height);
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
    painting.position.set(position.x, position.y, position.z);
    return painting;
}

const painting1 = createPainting('/artworks/0.jpg', 10, 5, new THREE.Vector3( 10, 5, -20));

const painting2 = createPainting('/artworks/1.jpg', 10, 5, 20, new THREE.Vector3(10, 5, 20));

scene.add(painting1, painting2);

// function when a kay is pressed, execute this function
function onKeyDown(event) {
    let keycode = event.which;

    // right arrow
    if(keycode === 39){
        camera.translateX(-0.05);
    }
    // left arrow key
    else if(keycode === 37) {
        camera.translateX(0.05);
    }
    // up arrow key
    else if(keycode === 38) {
        camera.translateY(-0.05);
    }
    // down arrow key
    else if(keycode === 40) {
        camera.translateY(0.05);
    }
}

// Render
let render = function () {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01; 

    renderer.render(scene, camera); // renders the scene

    requestAnimationFrame(render);
};

render();