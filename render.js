function render() {
  const TOOL_PENCIL = 1;  // 铅笔
  const TOOL_RECT = 2;    // 矩形
  const TOOL_CIRCEL = 3;  // 圆形
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const canvas_board = document.createElement('canvas');
  const ctx_board = canvas_board.getContext('2d');

  let isDown = false;
  let start = {};
  let end = {};
  let currentTool = TOOL_RECT;

  canvas.width = 300;
  canvas.height = 300;

  canvas_board.width = 300;
  canvas_board.height = 300;

  const CANVAS_STYLE = {
    'position': 'fixed',
    'width': '300px',
    'height': '300px',
    'bottom': '50px',
    'right': '50px',
    'border': '1px solid skyblue',
  };
  
  Object.assign(canvas.style, CANVAS_STYLE);
  Object.assign(canvas_board.style, CANVAS_STYLE);

  canvas.addEventListener('mousedown', e => {
    start = { x: e.offsetX, y: e.offsetY }
    isDown = true;
  })

  canvas.addEventListener('mousemove', e => {
    if (isDown) {
      const { offsetX, offsetY } = e;
      const w = offsetX-start.x;
      const h = offsetY-start.y;
      clearBoard();
      drawRect(ctx, start.x, start.y, w, h);
      end = { w, h }
    }
  })

  window.addEventListener('mouseup', e => {
    if(isDown) {
      clearBoard();
      drawRect(ctx_board, start.x, start.y, end.w, end.h);
      start = { x: e.offsetX, y: e.offsetY };
    }
    isDown = false;
  })

  const drawLine = (ctx, start, { x, y }) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.closePath();
  }

  const drawRect = (ctx, x, y, w, h) => {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.closePath();
    preRect = { x, y, w, h };
  }

  const clearBoard = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const clearRect = (ctx, { x, y, w, h }) => {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0)';
    ctx.strokeRect(x, y, w, h);
    ctx.closePath();
  }

  const changeTool = (type) => {

  }

  return {
    canvas,
    ctx,
    canvas_board,
    ctx_board,
    r(el) {
      let dom = null;

      if (typeof el === 'string') {
        dom = document.querySelector(el);
      } else {
        dom = el;
      }

      dom.appendChild(canvas_board);
      dom.appendChild(canvas);
    },
    clearBoard,
    changeTool,
  }
}

var board = render();
board.r(document.body)


class Point {
  x = 0
  y = 0

  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

class ShapeBase {
  index = 0                 // 层级
  color = '#ffffff'         // 颜色

  constructor(index = 0, color = '#ffffff') {
    this.index = index;
    this.color = color;
  }

  setColor(color) {
    this.color = color;
  }

  setIndex(index) {
    this.index = index;
  }

  observer() {
    console.log('observer');
  }
}

class Rect extends ShapeBase {
  position = { x: 0, y: 0, w: 0, h: 0}

  constructor({ x, y, w, h, index, color }) {
    super({ index, color });

    Object.assign(this.position, { x, y, w, h });
  }

  setPosition(pos = {}) {
    Object.assign(this.pos, pos);
  }
}

class Line extends ShapeBase {
  points = []

  constructor({ points = [], index, color}) {
    super({ index, color });
    
    this.points = points;
  }

  addPoint(point) {
    this.points.push(point);
  }

  clearPoints() {
    this.points = [];
  }
}

class Board {

}

class RenderAdapter {
  /**
   * 绘制圆弧路径的方法
   * 
   * @param x 圆弧中心（圆心）的 x 轴坐标
   * @param y 圆弧中心（圆心）的 y 轴坐标
   * @param radius 圆弧的半径
   * @param startAngle 圆弧的起始点，x 轴方向开始计算，单位以弧度表示
   * @param endAngle 圆弧的终点， 单位以弧度表示
   * @param anticlockwise 可选的Boolean值 ，如果为 true，逆时针绘制圆弧，反之，顺时针绘制
   * 
   */
  arc(x, y, radius, startAngle, endAngle, anticlockwise) {}

  /**
   * 根据控制点和半径绘制圆弧路径
   * 
   * @param x1 第一个控制点的 x 轴坐标。
   * @param y1  第一个控制点的 y 轴坐标。
   * @param x2 第二个控制点的 x 轴坐标。
   * @param y2 第二个控制点的 y 轴坐标。
   * @param radius 圆弧的半径。
   * 
   */
  arcTo(x1, y1, x2, y2, radius) {}

  /**
   * 通过清空子路径列表开始一个新路径的方法
   */
  beginPath() {}

  /**
   * 绘制三次贝赛尔曲线路径的方法
   * 
   * @param {Number} cp1x 第一个控制点的 x 轴坐标
   * @param {Number} cp1y 第一个控制点的 y 轴坐标
   * @param {Number} cp2x 第二个控制点的 x 轴坐标
   * @param {Number} cp2y 第二个控制点的 y 轴坐标
   * @param {Number} x 结束点的 x 轴坐标
   * @param {Number} y 结束点的 y 轴坐标
   * 
   */
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {}

  /**
   * 这个方法通过把像素设置为透明以达到擦除一个矩形区域的目的
   * 
   * @param {*} x 矩形起点的 x 轴坐标
   * @param {*} y 矩形起点的 y 轴坐标
   * @param {*} width 矩形的宽度
   * @param {*} height 矩形的高度
   * 
   */
  clearRect(x, y, width, height) {}

  /**
   * 将当前创建的路径设置为当前剪切路径的方法
   */
  clip() {}

  /**
   * 将笔点返回到当前子路径起始点的方法
   */
  closePath() {}

  /**
   * 
   * @param {*} startAngle The angle at which to begin the gradient, in radians. Angle measurements start vertically above the center and move around clockwise
   * @param {*} x The x-axis coordinate of the center of the gradient
   * @param {*} y The y-axis coordinate of the center of the gradient
   */
  createConicGradient(startAngle, x, y) {}

  /**
   * 
   * @param {*} width 图片宽度
   * @param {*} height 图片高度
   * @param {*} imagedata 图片像素数据
   */
  createImageData(width, height, imagedata) {}

  /**
   * 
   * @param {*} x0 开始x
   * @param {*} y0 开始y
   * @param {*} x1 结束x
   * @param {*} y1 结束y
   */
  createLinearGradient(x0, y0, x1, y1) {}

  /**
   * 
   * @param {*} image 
   * @param {*} repetition 
   */
  createPattern(image, repetition) {}

  /**
   * 
   * @param {*} x0 
   * @param {*} y0 
   * @param {*} r0 
   * @param {*} x1 
   * @param {*} y1 
   * @param {*} r1 
   */
  createRadialGradient(x0, y0, r0, x1, y1, r1) {}

  /**
   * 
   * @param {*} path 
   * @param {*} element 
   */
  drawFocusIfNeeded(path, element) {}

  /**
   * 
   * @param {*} image 
   * @param {*} sx 
   * @param {*} sy 
   * @param {*} sWidth 
   * @param {*} sHeight 
   * @param {*} dx 
   * @param {*} dy 
   * @param {*} dWidth 
   * @param {*} dHeight 
   */
  drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {}

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   * @param {*} radiusX 
   * @param {*} radiusY 
   * @param {*} rotation 
   * @param {*} startAngle 
   * @param {*} endAngle 
   * @param {*} counterclockwise 
   */
  ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise) {}

  /**
   * 
   * @param {*} path 
   * @param {*} fillRule 
   */
  fill(path, fillRule) {}

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   * @param {*} width 
   * @param {*} height 
   */
  fillRect(x, y, width, height) {}

  /**
   * 
   * @param {*} text 
   * @param {*} x 
   * @param {*} y 
   * @param {*} maxWidth 
   */
  fillText(text, x, y, maxWidth) {}

  /**
   * 
   */
  getContextAttributes() {}

  /**
   * 
   * @param {*} sx 
   * @param {*} sy 
   * @param {*} sw 
   * @param {*} sh 
   */
  getImageData(sx, sy, sw, sh) {}

  /**
   * 
   */
  getLineDash() {}

  /**
   * 
   */
  getTransform() {}

  /**
   * 
   * @param {*} path 
   * @param {*} x 
   * @param {*} y 
   * @param {*} fillRule 
   */
  isPointInPath(path, x, y, fillRule) {}

  /**
   * 
   * @param {*} path 
   * @param {*} x 
   * @param {*} y 
   */
  isPointInStroke(path, x, y) {}

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   */
  lineTo(x, y) {}

  /**
   * 
   * @param {*} text 
   */
  measureText(text) {}

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   */
  moveTo(x, y) {}

  /**
   * 
   * @param {*} imageData 
   * @param {*} dx 
   * @param {*} dy 
   * @param {*} dirtyX 
   * @param {*} dirtyY 
   * @param {*} dirtyWidth 
   * @param {*} dirtyHeight 
   */
  putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {}

  /**
   * 
   * @param {*} cpx 
   * @param {*} cpy 
   * @param {*} x 
   * @param {*} y 
   */
  quadraticCurveTo(cpx, cpy, x, y) {}

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   * @param {*} width 
   * @param {*} height 
   */
  rect(x, y, width, height) {}

  /**
   * 
   */
  restore() {}


  /**
   * 
   * @param {*} angle 
   */
  rotate(angle) {}

  /**
   * 
   */
  save() {}

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   */
  scale(x, y) {}

  /**
   * 
   * @param {*} segments 
   */
  setLineDash(segments) {}

  /**
   * 
   * @param {*} a 
   * @param {*} b 
   * @param {*} c 
   * @param {*} d 
   * @param {*} e 
   * @param {*} f 
   */
  setTransform(a, b, c, d, e, f) {}

  /**
   * 
   * @param {*} path 
   */
  stroke(path) {}

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   * @param {*} width 
   * @param {*} height 
   */
  strokeRect(x, y, width, height) {}

  /**
   * 
   * @param {*} text 
   * @param {*} x 
   * @param {*} y 
   * @param {*} maxWidth 
   */
  strokeText(text, x, y, maxWidth) {}

  /**
   * 
   * @param {*} a 
   * @param {*} b 
   * @param {*} c 
   * @param {*} d 
   * @param {*} e 
   * @param {*} f 
   */
  transform(a, b, c, d, e, f) {}

  /**
   * 
   * @param {*} x 
   * @param {*} y 
   */
  translate(x, y) {}
}

class BoardRender extends RenderAdapter {

}