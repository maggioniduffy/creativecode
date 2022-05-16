import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import palletes from "nice-color-palettes";
import { lerp } from "canvas-sketch-util/math"; //linear interpolation

const settings = {
  prefix: "art",
  name: Math.random(),
  suffix: ".draft",
  dimensions: [4096, 2048],
  scaleContext: true,
  document,
};

const sketch = () => {
  const colorCount = random.rangeFloor(3, 6);
  const palette = random.shuffle(random.pick(palletes)).slice(0, colorCount);
  const createGrid = () => {
    const points = [];
    const count = 150;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.5;
        points.push({
          color: random.pick(palette),
          radius,
          position: [u, v],
          rotation: random.noise2D(u, v) * 2,
        });
      }
    }
    return points;
  };

  //random.setSeed(512); //get always the same random
  const margin = 0;

  return async ({ context, width, height }) => {
    const points = createGrid().filter(() => random.value() > 0.5);
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.beginPath();
    context.font = `${100}px "Helvetica"`;
    context.fillText("Faustino Maggioni Duffy", 0, 0);
    context.closePath();
    points.forEach(({ color, radius, rotation, position }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.stroke();
      context.fillText(`o`, 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
