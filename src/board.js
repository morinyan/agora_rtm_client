const CANVAS_STYLE = {
  'width': '100%',
  'height': '100%',
};

export class BoardWebClient {
  constructor(options = {}) {
    this.canvas = null;
    this.context = null;
    this.isDown = false;
    this.canvasW = 300;
    this.canvasH = 150;
    this.startPoint = {};
    this.endPoint = {};
    this.strokeStyle = 'blue';
    this.lintWidth = 2;
    this.preRect = {};
    this.opts = {};
    this.observerMap = {};
    this.timer = null;
    Object.assign(this.opts, options);

    this.canvasW = options.canvasW;
    this.canvasH = options.canvasH;
    
    this.init();
  }

  init() {
    const { canvasH, canvasW } = this;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = canvasW;
    this.canvas.height = canvasH;

    Object.assign(this.canvas.style, CANVAS_STYLE);

    // events
    this.bindEventHandle();

    // render
    this.render();
  }

  render() {
    const { $el } = this.opts;

    if ($el instanceof Element) {
      $el.appendChild(this.canvas);
    } else {
      console.error('$el Not Element');
    }
  }

  drawRect(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke();
    ctx.closePath();
  }

  clearBoard(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
  }

  bindEventHandle() {
    const { canvas } = this;

    canvas.addEventListener('mousedown', e => {
      this.startPoint = { x: e.offsetX, y: e.offsetY }
      this.isDown = true;

      const mousedownHook = this.observerMap['mousedown'];

      if (typeof mousedownHook === 'function') {
        mousedownHook(this.startPoint);
      }
    })
  
    canvas.addEventListener('mousemove', e => {
      const { startPoint } = this;

      if (this.isDown) {
        const { offsetX, offsetY } = e;
        const w = offsetX-startPoint.x;
        const h = offsetY-startPoint.y;
        this.clearBoard(this.context, this.canvasW, this.canvasH);
        this.drawRect(this.context, startPoint.x, startPoint.y, w, h);

        const mousemoveHook = this.observerMap['mousemove'];

        if (typeof mousemoveHook === 'function') {
          if (this.timer) {
            clearTimeout(this.timer);
          }
  
          this.timer = setTimeout(() => {
            mousemoveHook({ x: startPoint.x, y: startPoint.y, w, h });
          }, 16);
        }
        
        this.endPoint = { w, h }
      }
    })
  
    window.addEventListener('mouseup', e => {
      const { startPoint, endPoint } = this;
      if(this.isDown) {
        this.clearBoard(this.context, this.canvasW, this.canvasH);
        this.drawRect(this.context, startPoint.x, startPoint.y, endPoint.w, endPoint.h);
      }
      this.isDown = false;

      const mouseupHook = this.observerMap['mouseup'];

      if (typeof mouseupHook === 'function') {
        mouseupHook({ x: e.offsetX, y: e.offsetY });
      }
    })
  }

  /**
   * 监听RTM消息
   * @param {String} message RTM接收的消息内容
   * @param {String} peerId RTM接收的发送消息的userID
   */
  bindMessageFromPeer(message, peerId) {
    console.log('MessageFromPeer::', { message, peerId });
    const position = JSON.parse(message.text);

    this.clearBoard(this.context, this.canvasW, this.canvasH);

    const xR = this.canvasW / position.width;
    const yR = this.canvasH / position.height;

    this.drawRect(this.context, position.x * xR, position.y * yR, position.w *xR, position.h * yR);
  }

  /**
   * 监听画板point变化
   * @param {Object} map 
   */
  observer(map) {
    Object.assign(this.observerMap, map);
  }
  
}

export default BoardWebClient;
