// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x2a2a2a); // Background color
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light with shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

const floorGeometry = new THREE.PlaneGeometry(10, 10, 32);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Create cube with color
const material = new THREE.MeshPhongMaterial({ color: 0x4CAF50 }); // Green color
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, material);
cube.position.y = geometry.parameters.height / 2 + 2; // Set cube's Y position slightly above the floor
cube.castShadow = true;
scene.add(cube);

// Set camera position and adjust field of view
const aspectRatio = window.innerWidth / window.innerHeight;
camera.aspect = aspectRatio;
camera.position.set(0, 3, 7); // Adjusted camera position to be higher and further back
camera.lookAt(cube.position); // Make camera look at the cube
camera.updateProjectionMatrix();

// Add interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the ray
    const intersects = raycaster.intersectObjects([cube]); // Only check for cube

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object === cube) { // Check if intersected object is cube
            intersects[i].object.rotation.x += 0.1; // Increased rotation speed
            intersects[i].object.rotation.y += 0.1;
        }
    }
}

document.addEventListener('mousemove', onMouseMove, false);
// Animation function
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate cube
    cube.rotation.x += 0.03; // Increased rotation speed
    cube.rotation.y += 0.03;

    renderer.render(scene, camera);
}

// Start animation
animate();

// Resize window
window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
