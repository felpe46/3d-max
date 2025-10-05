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

const starField = new THREE.Mesh(starGeo, starMat);
scene.add(starField);

const earthTexture = textureLoader.load('texturaTerra.jpg')

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

earth.position.x = 0;

scene.add( earth );



let velocity = new THREE.Vector3(-0.20, -0.20, 0);

const G = 0.01; // constante gravitacional fictícia
const offset = new THREE.Vector3(0, 5, 20); // ajuste aqui a posição da câmera em relação ao meteoro

let followMeteor = true;
function resetCameraPosition() {
    // posição original
    camera.position.set(0, 50, 10);
    controls.target.set(0, 0, 0); // olhar para o centro da cena
    controls.update(); // atualiza o controle
}

function animate() {
    if (meteor) {
        // Calcula a direção em direção à Terra
        const dir = earth.position.clone().sub(meteor.position).normalize();
        const force = dir.multiplyScalar(G);
        velocity.add(force);

        // Distância atual até o centro da Terra
        const distance = meteor.position.distanceTo(earth.position);

        // Raio da Terra + raio aproximado do meteoro
        const collisionDistance = 10 + 0.5; // earthRadius + meteorRadius

        if (distance > collisionDistance) {
            // Meteoro ainda não colidiu, ele continua caindo
            meteor.position.add(velocity);

            if (followMeteor) {
                camera.position.lerp(meteor.position.clone().add(offset), 0.1);
                camera.lookAt(earth.position);
            }
        } else {
            // Meteoro atingiu a Terra: trava a posição dentro da Terra
            velocity.set(0, 0, 0); // parar movimento

            // Coloca o meteoro exatamente na superfície
            meteor.position.copy(
                earth.position.clone().add(dir.multiplyScalar(collisionDistance))
            );

            // Libera a câmera para controle manual
            followMeteor = false;
        }
    }

    controls.update(); // OrbitControls funcionando
    renderer.render(scene, camera);
}
