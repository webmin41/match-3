class Game {
  items = []
  width = 0
  height = 0
  xSize = 0
  ySize = 0
  canvas = null
  active = null

  constructor (canvas, width, height, xSize, ySize) {
    this.canvas = canvas
    this.width = width
    this.height = height
    this.xSize = xSize
    this.ySize = ySize
    this.xBlock = width / xSize
    this.yBlock = height / ySize

    this.drawBoard(width, height, xSize, ySize)
    this.fillItem(xSize, ySize)
    this.showItem()

    this.bindEvent()
  }

  bindEvent () {
    this.canvas.addEventListener('mousedown', this.toggle.bind(this), false)
  }

  toggle (e) {
    const { xBlock, yBlock } = this
    const { offsetX, offsetY } = e
    const target = this.items.find(elem => {
      const { x: elemX, y: elemY } = elem.coordinate
      return elemX === Math.floor(offsetX / xBlock) && elemY === Math.floor(offsetY / yBlock)
    })

    if (this.active !== null) {
      this.swapItems(this.active, target)
    }

    this.active = this.active === null ? target : null
    this.showItem()
  }

  drawBoard (width, height, xSize, ySize) {
    const ctx = this.canvas.getContext('2d')
    const [tmpX, tmpY] = [Array(xSize).fill(null), Array(ySize).fill(null)]

    ctx.globalAlpha = 0.5

    tmpX.map((x, idx) => idx * this.x_block).forEach((x, idx) => ctx.fillRect(x, 0, 1, height))
    tmpY.map((x, idx) => idx * this.y_block).forEach((x, idx) => ctx.fillRect(0, x, width, 1))

    ctx.strokeRect(0, 0, width - 1, height - 1)
  }

  fillItem (xSize, ySize) {
    const [tmpX, tmpY] = [Array(xSize).fill(null), Array(ySize).fill(null)]

    tmpX.forEach((y, xIdx) => {
      tmpY.forEach((x, yIdx) => {
        this.items.push(new GameItem(xIdx, yIdx))
      })
    })

    this.items.forEach((x, idx) => {
      const { type } = x
      const [xBefore, xBefore2, yBefore, yBefore2] = [
        this.items[idx - 1],
        this.items[idx - 2],
        this.items[idx - ySize],
        this.items[idx - ySize * 2]
      ]

      if ((xBefore && xBefore2) && (xBefore.type === type && xBefore2.type === type)) {
        x.changeType()
      }

      if ((yBefore && yBefore2) && (yBefore.type === type && yBefore2.type === type)) {
        x.changeType()
      }
    })
  }

  showItem () {
    const { xBlock, yBlock, canvas, active } = this
    const ctx = canvas.getContext('2d')

    ctx.globalAlpha = 1
    ctx.font = '16pt Malgun Gothic'
    ctx.strokeStyle = '#fff'

    this.items.forEach((x) => {
      const { width } = ctx.measureText(x.type)
      const { background, coordinate: { x: elemX, y: elemY } } = x

      ctx.fillStyle = background
      ctx.fillRect(xBlock * elemX, yBlock * elemY, xBlock, yBlock)
      ctx.strokeRect(xBlock * elemX, yBlock * elemY, xBlock, yBlock)
      ctx.fillStyle = '#fff'
      ctx.fillText(x.type, xBlock * elemX + xBlock / 2 - width / 2, yBlock * elemY + yBlock / 2 + 12)
    })

    if (this.active !== null) {
      const { x: activeX, y: activeY } = active.coordinate

      ctx.globalAlpha = 1
      ctx.strokeStyle = '#d62527'
      ctx.strokeRect(activeX * xBlock, activeY * yBlock, xBlock, yBlock)
      ctx.strokeStyle = '#fff'
    }
  }

  swapItems (target, element) {
    const { x: targetX, y: targetY } = target.coordinate
    const { x: elemX, y: elemY } = element.coordinate
    const isValid = (
      (targetY === elemY && (targetX - 1 === elemX || targetX + 1 === elemX)) ||
      (targetX === elemX && (targetY - 1 === elemY || targetY + 1 === elemY))
    )

    if (isValid) {
      [element.coordinate, target.coordinate] = [{
        ...target.coordinate
      }, {
        ...element.coordinate
      }]
    }

    return isValid
  }
}

class GameItem {
  type = null
  types = [
    {
      type: 1,
      background: '#111'
    },
    {
      type: 2,
      background: '#222'
    },
    {
      type: 3,
      background: '#333'
    },
    {
      type: 4,
      background: '#444'
    },
    {
      type: 5,
      background: '#555'
    },
    {
      type: 6,
      background: '#666'
    }
  ]

  constructor (x, y) {
    Object.assign(this, this.types[Math.floor(Math.random() * this.types.length)])
    this.coordinate = { x, y }
  }

  changeType () {
    const valid = this.types.filter(x => x.type !== this.type)
    Object.assign(this, valid[Math.floor(Math.random() * valid.length)])
  }
}

window.onload = function () {
  const [width, height, xSize, ySize] = [760, 760, 12, 12]

  const canvas = document.getElementById('game')

  return new Game(canvas, width, height, xSize, ySize)
}
