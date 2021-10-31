import React, { useRef , useEffect } from 'react';
import './App.css';

// Using angles to create the different hands on the clocks
const topLeft = [0, 90]
const topRight = [90, 180]
const bottomLeft = [0, 270]
const bottomRight = [180, 270]
const horizontal = [0, 180]
const vertical = [90, 270]
const diagonal = [135, 135]

// A nested array of the angles to make the digits
// these need to be transposed before using them.
const digits = [
    // Number 0
    [
      [topLeft, horizontal, horizontal, topRight],
      [vertical, topLeft, topRight, vertical],
      [vertical, vertical, vertical, vertical],
      [vertical, vertical, vertical, vertical],
      [vertical, bottomLeft, bottomRight, vertical],
      [bottomLeft, horizontal, horizontal, bottomRight]
    ],
    // Number 1
    [
      [topLeft, horizontal, topRight, diagonal],
      [bottomLeft, topRight, vertical, diagonal],
      [diagonal, vertical, vertical, diagonal],
      [diagonal, vertical, vertical, diagonal],
      [topLeft, bottomRight, bottomLeft, topRight],
      [bottomLeft, horizontal, horizontal, bottomRight]
    ],
    // Number 2
    [
      [topLeft, horizontal, horizontal, topRight],
      [bottomLeft, horizontal, topRight, vertical],
      [topLeft, horizontal, bottomRight, vertical],
      [vertical, topLeft, horizontal, bottomRight],
      [vertical, bottomLeft, horizontal, topRight],
      [bottomLeft, horizontal, horizontal, bottomRight]
    ],
    // Number 3
    [
      [topLeft, horizontal, horizontal, topRight],
      [bottomLeft, horizontal, topRight, vertical],
      [diagonal, topLeft, bottomRight, vertical],
      [diagonal, bottomLeft, topRight, vertical],
      [topLeft, horizontal, bottomRight, vertical],
      [bottomLeft, horizontal, horizontal, bottomRight],
    ],
    // Number 4
    [
      [topLeft, topRight, topLeft, topRight],
      [vertical, vertical, vertical, vertical],
      [vertical, bottomLeft, bottomRight, vertical],
      [bottomLeft, horizontal, topRight, vertical],
      [diagonal, diagonal, vertical, vertical],
      [diagonal, diagonal, bottomLeft, bottomRight],
    ],
    // Number 5
    [
      [topLeft, horizontal, horizontal, topRight],
      [vertical, topLeft, horizontal, bottomRight],
      [vertical, bottomLeft, horizontal, topRight],
      [bottomLeft, horizontal, topRight, vertical],
      [topLeft, horizontal, bottomRight, vertical],
      [bottomLeft, horizontal, horizontal, bottomRight],
    ],
    // Number 6 
    [
      [topLeft, horizontal, horizontal, topRight],
      [vertical, topLeft, horizontal, bottomRight],
      [vertical, bottomLeft, horizontal, topRight],
      [vertical, topLeft, topRight, vertical],
      [vertical, bottomLeft, bottomRight, vertical],
      [bottomLeft, horizontal, horizontal, bottomRight],
    ],
    // Number 7
    [
      [topLeft, horizontal, horizontal, topRight],
      [bottomLeft, horizontal, topRight, vertical],
      [diagonal, diagonal, vertical, vertical],
      [diagonal, diagonal, vertical, vertical],
      [diagonal, diagonal, vertical, vertical],
      [diagonal, diagonal, bottomLeft, bottomRight],
    ],
    // Number 8
    [
      [topLeft, horizontal, horizontal, topRight],
      [vertical, topLeft, topRight, vertical],
      [vertical, bottomLeft, bottomRight, vertical],
      [vertical, topLeft, topRight, vertical],
      [vertical, bottomLeft, bottomRight, vertical],
      [bottomLeft, horizontal, horizontal, bottomRight],
    ],
    // Number 9
    [
      [topLeft, horizontal, horizontal, topRight],
      [vertical, topLeft, topRight, vertical],
      [vertical, bottomLeft, bottomRight, vertical],
      [bottomLeft, horizontal, topRight, vertical],
      [diagonal, diagonal, vertical, vertical],
      [diagonal, diagonal, bottomLeft, bottomRight],
    ]
];

const transpose = (a) => {
  return Object.keys(a[0]).map(function(c) {
      return a.map(function(r) { return r[c]; });
  });
}

const transposedDigits = digits.map(x => transpose(x));

/**
 * The Application
 */
function App() {
  const canvasRef = useRef(null);

  const draw = (canvas, context, frameCount) => {
    const rows = 4;
    const columns = 6;
    const radius = 25;
    const spacing = 3;

    clearCanvas(canvas, context);
    drawClocks(context, rows, columns, radius, spacing);
  }

  const drawClocks = (context, rows, columns, radius, spacing = 0) => {
    const diameter = radius * 2;
    const time = new Date();
    let hour = time.getHours();
    let seconds = time.getSeconds();
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`

    let [firstS, lastS] = seconds.toString().split('');

    let nextS = parseInt(lastS) == 9 ? 0 : parseInt(lastS) + 1;

    console.log("Last S: ", lastS, " NextS: ", nextS);

    const d = transposedDigits[parseInt(lastS)];
    const nextD = transposedDigits[nextS];

    for(let i = 0; i < d.length; i++){
      for(let j = 0; j < d[i].length; j++){
        let x = spacing + radius + (diameter * i);
        let y = spacing + radius + (diameter * j);
        let [angle1, angle2] = d[i][j]
        let [nextAngle1, nextAngle2] = nextD[i][j];

        console.log("Angle 1: ", angle1, " New Angle 1: ", nextAngle1);
        console.log("Angle 2: ", angle2, " New Angle 2: ", nextAngle2)
        drawClock(context, x, y, radius - spacing, angle1, angle2);
      }
    }
  }

  const drawClock = (context, x, y, radius, angle1, angle2) => {
    let a1 = angleToRadians(angle1);
    let a2 = angleToRadians(angle2);

    let x1 = x + radius * Math.cos(a1);
    let y1 = y + radius * Math.sin(a1);

    let x2 = x + radius * Math.cos(a2);
    let y2 = y + radius * Math.sin(a2);

    drawCircle(context, x, y, radius);
    drawLine(context, x, y, x1, y1);
    drawLine(context, x, y, x2, y2);
  }

  const drawCircle = (context, x, y, radius, circleColor = "#708090") => {
    context.strokeStyle = circleColor;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.stroke();

    context.strokeStyle = 'black'
  }

  const drawLine = (context, centerX, centerY, x, y, color="black") => {
    context.strokeStyle = color;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(x, y);
    context.stroke();

    context.strokeStyle = 'black';
  }

  const angleToRadians = (angle) => {
    return angle * Math.PI / 180;
  }

  const clearCanvas = (canvas, context) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
  
  useEffect(() => {
    if(canvasRef.current){
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      let frameCount = 0
      let animationFrameId

      const render = () => {
        frameCount++
        draw(canvas, context, frameCount)
        animationFrameId = window.requestAnimationFrame(render)
      }
      setInterval(render, 500)
      
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [draw] )
  
  return (
    <main>
      <canvas id="canvas" width="300" height="300" ref={canvasRef} style={{ backgroundColor: "lightblue"}}></canvas>
    </main>
  );
}

export default App;