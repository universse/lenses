/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from 'react'
import { css } from '@emotion/core'
import * as posenet from '@tensorflow-models/posenet'

import useThemeStore, { useZoom } from 'hooks/useThemeStore'

function useMousePosition () {
  const [mousePosition, setMousePosition] = useState([null, null])

  useEffect(() => {
    const updateMousePosition = e => setMousePosition([e.pageX, e.pageY])

    window.addEventListener('mousemove', updateMousePosition)

    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return mousePosition
}

export default () => {
  const zoom = useZoom()

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = 'visible'
    }
  }, [])

  const [x, y] = useMousePosition()

  const size = 300 * zoom
  const pos = 100
  const translate = 50 * zoom

  return (
    !isNaN(x) && (
      <div
        css={css`
          background-image: radial-gradient(
            rgba(0, 0, 0, 0.15) 12%,
            rgba(0, 0, 0, 0.99) 40%
          );
          height: ${size}vh;
          left: -${pos}vw;
          pointer-events: none;
          position: fixed;
          top: -${pos}vh;
          transform: scale(${1 / zoom})
            translate(
              calc(${x * zoom}px - ${translate}vw),
              calc(${y * zoom}px - ${translate}vh)
            );
          transform-origin: 0 0;
          width: ${size}vw;
          z-index: 9999;
        `}
      />
    )
  )
}

const HEIGHT = 240
const WIDTH = 360

function drawPoint (ctx, y, x, r, color) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}

function drawKeypoints (keypoints, minConfidence, ctx, scale = 1) {
  for (const { position, score } of keypoints) {
    if (score < minConfidence) continue

    const { y, x } = position
    drawPoint(ctx, y * scale, x * scale, 3, 'aqua')
  }
}

function VisionSimulationPage () {
  const videoRef = useRef()
  const canvasRef = useRef()

  useEffect(() => {
    videoRef.current.height = HEIGHT
    videoRef.current.width = WIDTH
    canvasRef.current.height = HEIGHT
    canvasRef.current.width = WIDTH

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'user', height: HEIGHT, width: WIDTH }
      })
      .then(async stream => {
        videoRef.current.srcObject = stream

        const ctx = canvasRef.current.getContext('2d')

        const net = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { height: HEIGHT, width: WIDTH },
          multiplier: 0.75
        })

        const minPoseConfidence = 0.1
        const minPartConfidence = 0.5

        async function poseDetectionFrame () {
          const pose = await net.estimateSinglePose(videoRef.current, {
            flipHorizontal: true
          })

          ctx.clearRect(0, 0, WIDTH, HEIGHT)
          ctx.save()
          ctx.scale(-1, 1)
          ctx.translate(-WIDTH, 0)
          ctx.drawImage(videoRef.current, 0, 0, WIDTH, HEIGHT)
          ctx.restore()

          const { score, keypoints } = pose

          if (score >= minPoseConfidence) {
            drawKeypoints(keypoints, minPartConfidence, ctx)
          }

          requestAnimationFrame(poseDetectionFrame)
        }

        poseDetectionFrame()
      })
      .catch(console.log)
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        css={css`
          display: none;
        `}
        playsInline
      />
      <canvas ref={canvasRef} />
    </>
  )
}
