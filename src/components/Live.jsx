import styles from "./Live.module.css"

import { useEffect, useRef, useState } from "react"

export default function Live() {
	const preview = useRef(null)

	const [cameras, setCameras] = useState([])
	const [screen, setScreen] = useState()

	useEffect(() => {

		navigator.mediaDevices.enumerateDevices().then((devices) => {
			const screens = devices.filter(
				(device) => device.kind === "videoinput"
			)
			setCameras(screens)
		})
	}, [])

	const startScreenSharing = () => {
		navigator.mediaDevices
			.getDisplayMedia({ video: true })
			.then((stream) => {
				preview.current.srcObject = stream
				preview.current.play()
			})
			.catch((error) => {
				console.error("Error accessing screen sharing:", error)
			})
	}

	function handleCameraSelect(e) {
		const selected = cameras.find(
			(screen) => screen.deviceId === e.target.id
		)

		navigator.mediaDevices
			.getUserMedia({
				video: {
					deviceId: {
						exact: e.target.id,
					},
				},
			})
			.then((stream) => {
				preview.current.srcObject = stream
				preview.current.play()
			})
			.catch((error) => {
				console.error("Error accessing video media devices:", error)
			})
	}

	return (
		<>
			<div className={styles.container}>
				<div className={styles.setup}>
					<div>
						{cameras.map((camera) => (
							<div key={camera.deviceId}>
								<input
									type='radio'
									name='screen'
									id={camera.deviceId}
									onChange={handleCameraSelect}
								/>
								<label htmlFor={camera.deviceId}>
									{camera.label}
								</label>
							</div>
						))}
					</div>
					<button onClick={startScreenSharing}>Use Screen</button>
					<div>
						<video src='' ref={preview}></video>
					</div>
				</div>
			</div>
		</>
	)
}
