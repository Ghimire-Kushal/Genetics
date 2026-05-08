"use client"

import { useEffect, useRef } from "react"

export function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth)
        this.y = Math.random() * (canvas?.height || window.innerHeight)
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        const colors = [
          "rgba(0, 210, 255, ",
          "rgba(59, 130, 246, ",
          "rgba(139, 92, 246, ",
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (canvas) {
          if (this.x > canvas.width) this.x = 0
          if (this.x < 0) this.x = canvas.width
          if (this.y > canvas.height) this.y = 0
          if (this.y < 0) this.y = canvas.height
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color + this.opacity + ")"
        ctx.fill()
      }
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const drawDNAHelix = (time: number) => {
      if (!ctx || !canvas) return

      const helixCount = 3
      const amplitude = 80
      const frequency = 0.02
      const speed = 0.001

      for (let h = 0; h < helixCount; h++) {
        const xOffset = (canvas.width / (helixCount + 1)) * (h + 1)
        const phaseOffset = (h * Math.PI * 2) / helixCount

        ctx.strokeStyle = `rgba(0, 210, 255, ${0.15 - h * 0.03})`
        ctx.lineWidth = 1

        // Draw helix strands
        for (let strand = 0; strand < 2; strand++) {
          ctx.beginPath()
          for (let y = 0; y < canvas.height; y += 2) {
            const x =
              xOffset +
              Math.sin(y * frequency + time * speed + phaseOffset + strand * Math.PI) *
                amplitude
            if (y === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.stroke()
        }

        // Draw connecting bars
        for (let y = 0; y < canvas.height; y += 30) {
          const x1 =
            xOffset +
            Math.sin(y * frequency + time * speed + phaseOffset) * amplitude
          const x2 =
            xOffset +
            Math.sin(y * frequency + time * speed + phaseOffset + Math.PI) * amplitude

          const gradient = ctx.createLinearGradient(x1, y, x2, y)
          gradient.addColorStop(0, `rgba(139, 92, 246, ${0.3 - h * 0.05})`)
          gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.4 - h * 0.05})`)
          gradient.addColorStop(1, `rgba(0, 210, 255, ${0.3 - h * 0.05})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x1, y)
          ctx.lineTo(x2, y)
          ctx.stroke()

          // Draw nodes
          ctx.fillStyle = `rgba(0, 210, 255, ${0.6 - h * 0.1})`
          ctx.beginPath()
          ctx.arc(x1, y, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(x2, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const connectParticles = () => {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 210, 255, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = (time: number) => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background overlay
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        0,
        canvas.width / 2,
        canvas.height / 3,
        canvas.width * 0.8
      )
      bgGradient.addColorStop(0, "rgba(59, 130, 246, 0.1)")
      bgGradient.addColorStop(0.5, "rgba(139, 92, 246, 0.05)")
      bgGradient.addColorStop(1, "transparent")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawDNAHelix(time)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      connectParticles()

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate(0)

    window.addEventListener("resize", () => {
      resizeCanvas()
      initParticles()
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  )
}
