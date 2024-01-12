import styles from "./Live.module.css"
import { io } from "socket.io-client"
import { useEffect, useRef, useState } from "react"

export default function Live() {
	const preview = useRef(null)
	const streamSrcObj = useRef(null)
	const setupDiv = useRef(null)
	const startStream = useRef(null)
	const stopStream = useRef(null)
	const socketRef = useRef(null)
	const remoteVideoRef = useRef(null)

	const [cameras, setCameras] = useState([])

	useEffect(() => {
		stopStream.current.style.display = "none"
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			const screens = devices.filter(
				(device) => device.kind === "videoinput"
			)
			setCameras(screens)
		})

		const URL = "http://localhost:3000"
		const socket = io(URL, {
			autoConnect: false,
		})
		socketRef.current = socket

		socket.on("connect", () => {
			console.log("connected")

			socket.on("disconnect", () => {
				console.log("disconnected")
			})

			// Event listener for receiving screen-sharing video frames
			socket.on("screen-share", (data) => {
				try {
					const blob = new Blob([data], { type: "video/webm; codecs=vp8" })
					const videoURL = window.URL.createObjectURL(blob)
					remoteVideoRef.current.src = videoURL
				} catch (error) {
					console.log("Error setting video source:", error)
				}
			})

		})

		return () => {
			socketRef.current.disconnect()
		}
	}, [])

	function handleConnect() {
		socketRef.current.connect()
	}

	function handleStop() {
		socketRef.current.disconnect()
		stopStream.current.style.display = "none"
		startStream.current.style.display = "block"
	}

	function changeCamera(e) {
		// change preview to selected camera and set streamSrcObj

		navigator.mediaDevices
			.getUserMedia({
				video: {
					deviceId: {
						exact: e.target.id,
					},
				},
			})
			.then((stream) => {
				streamSrcObj.current = stream
				preview.current.srcObject = stream
				preview.current.play()
			})
			.catch((error) => {
				console.error("Error accessing video media devices:", error)
			})
	}

	function handleStart() {
		// connect socket
		socketRef.current.connect()

		// hide ui
		stopStream.current.style.display = "block"
		startStream.current.style.display = "none"

		// start screen sharing
		startScreenSharing()
	}

	function startScreenSharing() {
		const mediaRecorder = new MediaRecorder(streamSrcObj.current)
		console.log(mediaRecorder)
		// Event listener for capturing video frames
		mediaRecorder.ondataavailable = (e) => {
			console.log(e.data)
			if (e.data.size > 0) {
				console.log(e.data)
				socketRef.current.emit("screen-share", e.data) // Send video frames to the server
			}
		}
		// Start recording video frames
		mediaRecorder.start(1000)
	}

	return (
		<>
			<video src='' ref={remoteVideoRef}></video>
			<p>video here</p>
			<div className={styles.container}>
				<div className={styles.setup} ref={setupDiv}>
					<div>
						{cameras.map((camera) => (
							<div key={camera.deviceId}>
								<input
									type='radio'
									name='screen'
									id={camera.deviceId}
									onChange={changeCamera}
								/>
								<label htmlFor={camera.deviceId}>
									{camera.label}
								</label>
							</div>
						))}
					</div>

					<div>
						<video src='' ref={preview}></video>
					</div>
				</div>
				<div>
					<button onClick={handleStart} ref={startStream}>
						Start
					</button>
					<button onClick={handleStop} ref={stopStream}>
						Stop
					</button>
					<button onClick={handleConnect}>Connect</button>
				</div>
			</div>
		</>
	)
}
