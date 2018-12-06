let listening = false
let targets = []

const defaultOptions = {
  speed: 0.3,
}

class RallaxObj {
  constructor(target, { speed }) {
    this.speed = speed || defaultOptions.speed
		this.conditions = []
    this.active = true
		this.target = target

    if (typeof target === 'string') {
      this.target = document.querySelector(`${target}`)
    }

    this.winHeight = window.innerHeight
		this.accumulated = 0
    this.getRect()

    this.startScroll = this.targetR.top - this.winHeight > 0
      ? this.targetR.top - this.winHeight
      : 0
  }

	// API
  stop() {
    this.active = false
  }

  start() {
    this.active = true
  }

	changeSpeed(newSpeed) {
		if (this.inWindow()) {
			this.accumulated = this.getTranslation()
			this.startScroll = window.scrollY
		}
		this.speed = newSpeed
	}

	when(condition, action) {
		this.conditions.push({condition, action})
	}

	// HELPERS
  getTranslation() {
    const dist = window.scrollY - this.startScroll
    const translation = dist * this.speed
		return translation + this.accumulated
  }

  getRect() {
    this.targetR = this.target.getBoundingClientRect()
    return this.targetR
  }

	inWindow() {
		this.getRect()
		const top = this.targetR.top
		const bottom = this.targetR.bottom

		return top < this.winHeight && bottom > 0
	}

  move() {
    this.target
      .style
      .transform = `translateY(${this.getTranslation()}px)`
  }
}

const addListener = () => {
  window.addEventListener('scroll', event => {
    controller(targets)
  })
}

const controller = targets => {
  requestAnimationFrame(() => {
    targets.forEach(obj => {
			obj
				.conditions
				.forEach(({condition, action}) => {
					if (condition()) action()
				})

      if (obj.active) {
        obj.move()
      }
    })
  })
}

export default (target, userOptions = {}) => {
  const rallax = new RallaxObj(target, userOptions)
  targets.push(rallax)

  if (!listening) {
    addListener()
    listening = true
  }

  return rallax
}