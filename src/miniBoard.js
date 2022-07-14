export class BoardMiniClient {
    constructor(options = {}) {
      this.context = null
      this.canvasW = 300
      this.canvasH = 150
      this.strokeStyle = 'black'
      this.lintWidth = 2
      this.opts = {}
      Object.assign(this.opts, options)
  
      this.canvasW = options.canvasW
      this.canvasH = options.canvasH
      this.context = options.context
    }
  
    drawRect(ctx, x, y, w, h) {
      ctx.rect(x, y, w, h)
      ctx.setStrokeStyle(this.strokeStyle)
      ctx.stroke()
      ctx.draw()
    }
  
    clearBoard(ctx, w, h) {
      ctx.clearRect(0, 0, w, h)
      ctx.draw()
    }
  
    /**
     * 监听RTM消息
     * @param {String} message RTM接收的消息内容
     * @param {String} peerId RTM接收的发送消息的userID
     */
    bindMessageFromPeer(data, peerId) {
      const pos = data.position
      const { context, canvasW, canvasH } = this
      console.log('开始画图:', { pos, data });
  
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
  }
  
  export default BoardMiniClient
  