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
    this.items = Array(ySize).fill([]).map(x => [...x])

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
      const { x: elemX, y: elemY } = elem.position
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

    tmpX.map((x, idx) => idx * this.x_block).forEach(x => ctx.fillRect(x, 0, 1, height))
    tmpY.map((x, idx) => idx * this.y_block).forEach(x => ctx.fillRect(0, x, width, 1))

    ctx.strokeRect(0, 0, width - 1, height - 1)
  }

  fillItem (xSize, ySize) {
    const [tmpX, tmpY] = [Array(xSize).fill(null), Array(ySize).fill(null)]

    const types = [
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

    tmpY.forEach((y, yIdx) => {
      tmpX.forEach((x, xIdx) => {
        const item = types[Math.floor(Math.random() * (types.length - 1))]
        this.items[xIdx][yIdx] = new GameItem(item)
        this.showItem()
      })
    })

    this.items.forEach((y, yPos, orgY) => {
      y.forEach((x, xPos, orgX) => {
        const { type: now } = x

        const [xBefore, xBefore2, yBefore, yBefore2] = [
          orgX[xPos - 1],
          orgX[xPos - 2],
          orgY[yPos - 1] ? orgY[yPos - 1][xPos] : null,
          orgY[yPos - 2] ? orgY[yPos - 2][xPos] : null
        ]

        if (
          (xBefore && xBefore2) && (xBefore.type === now && xBefore2.type === now)
        ) this.items[yPos][xPos] = types.filter(x => x.type !== now)[Math.floor(Math.random() * 5)]

        if (
          (yBefore && yBefore2) && (yBefore.type === now && yBefore2.type === now)
        ) this.items[yPos][xPos] = types.filter(x => x.type !== now)[Math.floor(Math.random() * 5)]
      })
    })
  }

  showItem () {
    const { xBlock, yBlock, canvas, active } = this
    const ctx = canvas.getContext('2d')

    ctx.globalAlpha = 1
    ctx.font = '16pt Malgun Gothic'
    ctx.strokeStyle = '#fff'

    this.items.forEach((y, elemY) => {
      y.forEach((x, elemX) => {
        const { type, background } = x
        const { width } = ctx.measureText(type)

        ctx.fillStyle = background
        ctx.fillRect(xBlock * elemX, yBlock * elemY, xBlock, yBlock)
        ctx.strokeRect(xBlock * elemX, yBlock * elemY, xBlock, yBlock)
        ctx.fillStyle = '#fff'
        ctx.fillText(x.type, xBlock * elemX + xBlock / 2 - width / 2, yBlock * elemY + yBlock / 2 + 12)
      })

      if (this.active !== null) {
        const { x: activeX, y: activeY } = active.position

        ctx.globalAlpha = 1
        ctx.strokeStyle = '#d62527'
        ctx.strokeRect(activeX * xBlock, activeY * yBlock, xBlock, yBlock)
        ctx.strokeStyle = '#fff'
      }
    })
  }

  swapItems (target, element) {
    const { x: targetX, y: targetY } = target.position
    const { x: elemX, y: elemY } = element.position
    const isValid = (
      (targetY === elemY && (targetX - 1 === elemX || targetX + 1 === elemX)) ||
      (targetX === elemX && (targetY - 1 === elemY || targetY + 1 === elemY))
    )

    if (isValid) {
      const tmp = { ...element.position }
      element.position = target.position
      target.position = tmp
    }

    return isValid
  }

  getMatching (idx) {
    const { items } = this
    const start = items[idx]
    let [posX, posY] = Array(2).fill(0)

    while (items[idx - 1 - posX].type === start.type) {
      posX += 1
    }

    while (items[idx - 1 - posY].type === start.type) {
      posY += 1
    }
  }
}

class GameItem {
  type = null

  constructor ({ type, background }) {
    this.type = type
    this.background = background
  }
}

window.onload = function () {
  const [width, height, xSize, ySize] = [760, 760, 12, 12]

  const canvas = document.getElementById('game')

  return new Game(canvas, width, height, xSize, ySize)
}
