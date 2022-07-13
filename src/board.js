const CANVAS_STYLE = {
  'width': '100%',
  'height': '100%',
}

export class BoardWebClient {
  constructor(options = {}) {
    this.canvas = null
    this.context = null
    this.isDown = false
    this.canvasW = 300
    this.canvasH = 150
    this.startPoint = {}
    this.endPoint = {}
    this.strokeStyle = 'black'
    this.lintWidth = 2
    this.preRect = {}
    this.opts = {}
    this.observerMap = {}
    this.timer = null
    this.clearBoardTime = 10000
    this.frameTime = 16
    Object.assign(this.opts, options)

    this.canvasW = options.canvasW
    this.canvasH = options.canvasH
    
    this.init()
  }

  init() {
    const { canvasH, canvasW, opts } = this

    const canvas = document.createElement('canvas')
    canvas.width = canvasW
    canvas.height = canvasH
    // css style
    Object.assign(canvas.style, CANVAS_STYLE)

    this.canvas = canvas
    this.context = canvas.getContext('2d')

    this.bindBoardEventHandler(canvas)
    this.render(opts.$el, canvas)
  }

  /**
   * 渲染board到Web页面容器
   * @param {Element} el DOM元素
   * @param {Element} canvas 创建的Canvas元素
   */
  render(el, canvas) {
    if (el instanceof Element) {
      el.appendChild(canvas)
    } else {
      console.error('$el Not Element')
    }
  }

  drawRect(ctx, x, y, w, h) {
    ctx.beginPath()
    ctx.strokeStyle = this.strokeStyle
    ctx.strokeRect(x, y, w, h)
    ctx.closePath()
  }

  clearBoard(ctx, w, h) {
    ctx.clearRect(0, 0, w, h)
  }

  /**
   * 画板事件绑定
   * @param {Element} canvas 
   */
  bindBoardEventHandler(canvas) {
    const { bindEvent } = this

    bindEvent(canvas,'mousedown', e => {
      this.startPoint = { x: e.offsetX, y: e.offsetY }
      this.isDown = true

      const hook = this.getHook('mousedown')
      hook(this.startPoint)

    })
  
    bindEvent(canvas, 'mousemove', e => {
      const { startPoint } = this

      if (this.isDown) {
        const { offsetX, offsetY } = e
        const w = offsetX-startPoint.x
        const h = offsetY-startPoint.y
        this.clearBoard(this.context, this.canvasW, this.canvasH)
        this.drawRect(this.context, startPoint.x, startPoint.y, w, h)

        const hook = this.getHook('mousemove')
        this.debounce(() => {
          hook({ x: startPoint.x, y: startPoint.y, w, h })
        })
        
        this.endPoint = { w, h }
      }
    })
  
    bindEvent(window, 'mouseup', e => {
      const { startPoint, endPoint } = this
      if(this.isDown) {
        this.clearBoard(this.context, this.canvasW, this.canvasH)
        this.drawRect(this.context, startPoint.x, startPoint.y, endPoint.w, endPoint.h)
      }
      this.isDown = false

      const hook = this.getHook('mouseup')
      hook({ x: e.offsetX, y: e.offsetY })

      this.debounce(() => {
        if (!this.isDown) {
          this.clearBoard(this.context, this.canvasW, this.canvasH)
          this.getHook('custom')({
            type: 'CLEAR',
            data: {},
          })
        }
      }, this.clearBoardTime);

    })
  }

  /**
   * 监听RTM消息
   * @param {String} message RTM接收的消息内容
   * @param {String} peerId RTM接收的发送消息的userID
   */
  bindMessageFromPeer(data, peerId) {
    const pos = data.position
    const { context, canvasW, canvasH } = this

    if (data.type === 'RECT') {

      this.clearBoard(context, canvasW, canvasH)

      const xR = canvasW / pos.width
      const yR = canvasH / pos.height

      this.drawRect(context, pos.x * xR, pos.y * yR, pos.w *xR, pos.h * yR)
    
    }

    if (data.type === 'CLEAR') {
      this.clearBoard(context, canvasW, canvasH)
    }
  }

  /**
   * 监听画板事件
   * @param {Object} map 事件映射
   */
  observer(map) {
    Object.assign(this.observerMap, map)
  }

  bindEvent(el, event, callback) {
    el.addEventListener(event, callback)
  }

  // 获取hook
  getHook(name) {
    return this.observerMap[name] || (() => {})
  }

  debounce(fn, t = 16) {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    this.timer = setTimeout(fn, t)
  }
}

export default BoardWebClient
