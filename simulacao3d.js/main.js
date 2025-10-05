import * as THREE from 'https://esm.sh/three@0.158.0';
import { OrbitControls } from 'https://esm.sh/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://esm.sh/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';


//CAMERA
const fov = 75
const aspect = 2;
const near = 0.1;
const far = 1000;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	controls.update();

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 1, 32, 32 );
const geometry2 = new THREE.SphereGeometry( 10, 100, 100 );

const textureLoader = new THREE.TextureLoader();
const loader = new THREE.TextureLoader();

const starGeo = new THREE.SphereGeometry(500, 64, 64);
const starMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load('8k_stars.jpg'),
  side: THREE.BackSide
});

const cometTexture = textureLoader.load('textura_asteroide.jpg');
const earthTexture = textureLoader.load('texturaTerra.jpg')

const materialAsteroid = new THREE.MeshBasicMaterial( { 
    map: cometTexture
} );


const materialEarth = new THREE.MeshBasicMaterial( { 
    map: earthTexture
} );


let meteor;
const loader3D = new GLTFLoader();
loader3D.load('meteor.glb', (glb) => {
    meteor = glb.scene;
  meteor.scale.set(0.5, 0.5, 0.5);
  meteor.position.set(50, 20, 0);
  scene.add(meteor);
});



const earth = new THREE.Mesh( geometry2, materialEarth );
meteor = new THREE.Mesh( geometry, materialAsteroid );

const earthRadius = 10;
const cometRadius = 1;
const gap = 5;

const totalDistance = earthRadius + cometRadius + gap;

earth.position.x = 0;


scene.add( earth );



let velocity = new THREE.Vector3(-0.1, -0.02, 0);

const G = 0.01; // constante gravitacional fictícia
const offset = new THREE.Vector3(0, 5, 20); // ajuste aqui a posição da câmera em relação ao meteoro


function animate() {

    const dir = earth.position.clone().sub(meteor.position).normalize();
    const force = dir.multiplyScalar(G);
    velocity.add(force); // acelera em direção à Terra
    meteor.position.add(velocity);

    camera.position.lerp(meteor.position.clone().add(offset), 0.1);
    camera.lookAt(earth.position);

    const distance = meteor.position.distanceTo(earth.position);
    if (distance < 11) {
        velocity.set(0, 0, 0);
    }

    meteor.position.add(velocity);

    renderer.render( scene, camera );
}