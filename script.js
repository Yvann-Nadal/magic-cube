var scene, camera, renderer, cube;
var stats, gui;
var audio, analyser, frequencyData;
var cubeRotation = { x: 0, y: 0, z: 0 };

init();
animate();

function init() {

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cube
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Audio
    audio = new Audio();
    audio.src = 'music.mp3'
    audio.crossOrigin = "anonymous";
    audio.play();

    // Analyser
    var context = new AudioContext();
    var source = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(context.destination);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
}
function updateCubeColor() {

    // Générer une couleur aléatoire
    cube.material.color.setRGB(Math.random(), Math.random(), Math.random());
}
function animate() {
    requestAnimationFrame(animate);

    // Update Cube Rotation
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    cube.rotation.z += 0.03;

    // Update Cube Scale
    analyser.getByteFrequencyData(frequencyData);
    var frequency = getAverageFrequency(frequencyData);
    var scale = 1 + frequency / 100;
    cube.scale.set(scale, scale, scale);

    // Update Cube Color
    updateCubeColor();

    // Render
    renderer.render(scene, camera);
}

function getAverageFrequency(frequencyData) {
    var sum = 0;
    for (var i = 0; i < frequencyData.length; i++) {
        sum += frequencyData[i];
    }
    return sum / frequencyData.length;
}