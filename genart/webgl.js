// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
import random from "canvas-sketch-util/random";
import palettes from "nice-color-palettes";
import eases from "eases";
import BezierEasing from "bezier-easing";
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: true },
  dimensions: [512, 512],
  fps: 24,
  duration: 8,
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("hsl(0,0%, 90%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const palette = random.pick(palettes);
  for (let i = 0; i < 50; i++) {
    // Setup a geometry
    // Setup a material
    const material = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
    });
    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.5); //multiplica x,y y z por el mismo valor
    scene.add(mesh);
  }

  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(0, 2, 4);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight("hsl(0,0%,40%)");
  scene.add(ambientLight);

  const easeFn = BezierEasing(0.24, 0.6, 0.9, 1);
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      // Setup an isometric perspective
      const aspect = viewportWidth / viewportHeight;
      const zoom = 2;
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      //mesh.rotation.y = time * ((10 * Math.PI) / 180);
      //controls.update();
      //playhead is only used with a duration specified
      const t = Math.sin(playhead * Math.PI);
      scene.rotation.z = easeFn(t);
      scene.rotation.x = easeFn(t);
      scene.rotation.y = easeFn(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      //controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
