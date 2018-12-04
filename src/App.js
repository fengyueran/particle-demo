import React, { Component } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  background: lightGray;
  display: block;
`;

const color1 = `#00b7ffcc`;
const color2 = 'red';
const Actions = [
  { lifeTime: 60, texts: [{ text: 3, color: color1 }] },
  { lifeTime: 60, texts: [{ text: 2, color: color1 }] },
  { lifeTime: 60, texts: [{ text: 1, color: color1 }] },
  { 
    lifeTime: 120,
    texts: [
      { text: 'I', color: color1 },
      { text: '❤', color: color2 },
      { text: 'Y', color: color1 },
      { text: 'O', color: color1 },
      { text: 'U', color: color1 }
    ] 
  },
];
class App extends Component {
  constructor() {
    super();
    this.tick = 0;
    this.actionsIndex = 0;
    this.geometrys = [];
  }

  componentDidMount() {
    const offscreenCanvas = this.createOffscreenCanvas();
    this.getTextsData(offscreenCanvas);
    this.draw();
  }

  createOffscreenCanvas= () => {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;
    return this.offscreenCanvas;
  }

  getTextsData = (offscreenCanvas) => {
    const offscreenCanvasCtx = offscreenCanvas.getContext('2d');
    const width = offscreenCanvas.width;
    const height = offscreenCanvas.height;
    Actions.forEach(({ texts }) => {
      const str = this.composeText(texts);
      const position = this.calcTextsPosition(offscreenCanvas, str);
      let left = position.left;
      const geometry = [];
      texts.forEach(({ text, color }) => {
        offscreenCanvasCtx.clearRect(0, 0, width, height);
        offscreenCanvasCtx.fillText(text, left, position.bottom);
        left += offscreenCanvasCtx.measureText(text).width;
        const data = offscreenCanvasCtx.getImageData(0, 0, width, height);
        const points = this.getTargetPoints(data);
        geometry.push({ color, points });
      });

      this.geometrys.push(geometry);
    });
  };

  composeText = (textArr) => {
    const composeStr = (str, item) => `${str}${item.text}`;
    const str = textArr.reduce(composeStr, '');
    return str;
  }

  calcTextsPosition = (offscreenCanvas, texts) => {
    const width = offscreenCanvas.width;
    const height = offscreenCanvas.height;
    const offscreenCanvasCtx = offscreenCanvas.getContext('2d');

    // caculate font size
    offscreenCanvasCtx.font = 'bold 10px Arial';
    const measure = offscreenCanvasCtx.measureText(texts);
    const textHeightRatio = 0.8;
    const lineHeight = 7; // 10px字体行高 lineHeight=7px
    const finalSize = Math.min(height * textHeightRatio * 10 / lineHeight,
      width * textHeightRatio * 10 / measure.width);
    offscreenCanvasCtx.font = `bold ${finalSize}px Arial`;

    // caculate resized texts position of canvas center
    const measureResize = offscreenCanvasCtx.measureText(texts);
    const left = (width - measureResize.width) / 2;
    const bottom = (height + finalSize / 10 * lineHeight) / 2;
    return { left, bottom };
  }

  getTargetPoints = (data, intervel = 4) => {
    const points = [];
    const rows = data.height;
    const cols = data.width;

    for (let i = 0; i < rows; i += intervel) { // 按行储存
      for (let j = 0; j < cols; j += intervel) {
        const alpha = data.data[(i * cols + j) * 4 + 3];
        if (alpha) {
          points.push({
            x: j, // j行i列对于坐标而言是(x, y)即(列,行)
            y: i
          });
        }
      }
    }

    // for (let i = 0; i < rows * cols; i += intervel) {
    //   const alpha = data.data[4 * i + 3];
    //   if (alpha) {
    //     const x = i % cols;
    //     const y = Math.floor(i / cols);
    //     points.push({
    //       x: x + (Math.random() - 0.5) * 20,
    //       y: y + (Math.random() - 0.5) * 20,
    //     });
    //   }
    // }
    return points;
  }


  renderParticles = () => {
    const offscreenCanvasCtx = this.offscreenCanvas.getContext('2d');
    const { width, height } = this.canvas;
    const geometry = this.geometrys[this.actionsIndex];
    geometry.forEach(({ color, points }) => {
      offscreenCanvasCtx.fillStyle = color;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        offscreenCanvasCtx.fillRect(p.x, p.y, 2, 2);
      }
    });
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.offscreenCanvas, 0, 0, width, height);
  }

  clear = () => {
    const { width, height } = this.canvas;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const offscreenCanvasCtx = this.offscreenCanvas.getContext('2d');
    offscreenCanvasCtx.clearRect(0, 0, width, height);
  }

  nextAction = () => {
    ++this.actionsIndex;
    this.tick = 0;
    if (this.actionsIndex === Actions.length) {
      this.actionsIndex = 0;
    }
  }

  draw = () => {
    this.tick++;
    if (this.tick >= Actions[this.actionsIndex].lifeTime) {
      this.nextAction();
    }
    this.clear();
    this.renderParticles();
    requestAnimationFrame(this.draw);
  }

  initCanvas = (c) => {
    this.canvas = c;
    this.canvas.width = c.clientWidth;
    this.canvas.height = c.clientHeight;
  }

  render() {
    return (
      <Canvas innerRef={this.initCanvas} />
    );
  }
}

export default App;
