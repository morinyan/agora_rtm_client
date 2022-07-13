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

      const mousedownHook = this.observerMap['mousedown']

      if (typeof mousedownHook === 'function') {
        mousedownHook(this.startPoint)
      }
    })
  
    bindEvent(canvas, 'mousemove', e => {
      const { startPoint } = this

      if (this.isDown) {
        const { offsetX, offsetY } = e
        const w = offsetX-startPoint.x
        const h = offsetY-startPoint.y
        this.clearBoard(this.context, this.canvasW, this.canvasH)
        this.drawRect(this.context, startPoint.x, startPoint.y, w, h)

        const mousemoveHook = this.observerMap['mousemove']

        if (typeof mousemoveHook === 'function') {
          if (this.timer) {
            clearTimeout(this.timer)
          }
  
          this.timer = setTimeout(() => {
            mousemoveHook({ x: startPoint.x, y: startPoint.y, w, h })
          }, 16)
        }
        
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

      const mouseupHook = this.observerMap['mouseup']

      if (typeof mouseupHook === 'function') {
        mouseupHook({ x: e.offsetX, y: e.offsetY })
      }
    })
  }

  // bind event
  bindEvent(el, event, callback) {
    el.addEventListener(event, callback)
  }

  /**
   * 监听RTM消息
   * @param {String} message RTM接收的消息内容
   * @param {String} peerId RTM接收的发送消息的userID
   */
  bindMessageFromPeer(message, peerId) {
    console.log('MessageFromPeer::', { message, peerId })
    const position = JSON.parse(message.text)

    this.clearBoard(this.context, this.canvasW, this.canvasH)

    const xR = this.canvasW / position.width
    const yR = this.canvasH / position.height

    this.drawRect(this.context, position.x * xR, position.y * yR, position.w *xR, position.h * yR)
  }

  /**
   * 监听画板事件
   * @param {Object} map 事件映射
   */
  observer(map) {
    Object.assign(this.observerMap, map)
  }
  
}

export default BoardWebClient
