import styles from "./Player.module.css"
import React, { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import ReactPlayer from "react-player"
import {
	BsFillPauseFill,
	BsFillPlayFill,
	BsVolumeUpFill,
	BsVolumeMuteFill,
} from "react-icons/bs"

export default function Player({ src }) {
	const { id } = useParams()
	src += id

	const player = useRef(null)
	const videoWrapper = useRef(null)

	const [playing, setPlaying] = useState(false)
	const [muted, setMuted] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [duration, setDuration] = useState(null)
	const [consumed, setConsumed] = useState(0)
	const [buffered, setBuffered] = useState(0)

	useEffect(() => {
		setPlaying(true)
	}, [])

	function handleFullscreen() {
		console.log(videoWrapper)
		if (!isFullscreen) {
			videoWrapper.current.requestFullscreen().then(
				(result) => {
					setIsFullscreen(true)
				},
				(error) => {
					console.log(error)
				}
			)
		} else {
			document.exitFullscreen().then(
				(result) => {
					setIsFullscreen(false)
				},
				(error) => {
					console.log(error)
				}
			)
		}
	}

	function handleProgress(e) {
		setConsumed(e.played)
		setBuffered(e.loaded)
	}

	function handleSeek(event) {
		if (event.type === "click") {
			const newTime =
				event.nativeEvent.offsetX / event.nativeEvent.target.offsetWidth
			player.current.seekTo(newTime, "fraction")
		}
		if (event.type === "mousemove") {
			if (event.buttons !== 1) return
			setPlaying(false)
			const newTime =
				event.nativeEvent.offsetX / event.nativeEvent.target.offsetWidth
			player.current.seekTo(newTime, "fraction")
		}
		if (event.type === "mouseup") {
			setPlaying(true)
		}
	}

	return (
		<div className={styles["video-container"]}>
			<div
				className={styles["player-wrapper"]}
				ref={videoWrapper}
				onDoubleClick={handleFullscreen}>
				<ReactPlayer
					ref={player}
					className={styles.player}
					width='100%'
					height='100%'
					url={src}
					config={{
						file: {
							forceHLS: true,
						},
					}}
					muted={muted}
					progressInterval={0}
					onClick={() => setPlaying((playing) => !playing)}
					playing={playing}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
					onProgress={handleProgress}
				/>
				<div className={styles["controls-container"]}>
					{/* progress bar */}
					<div className={styles["video-progress"]}>
						<div
							className={styles["video-bar"]}
							onClick={handleSeek}
							onMouseMove={handleSeek}
							onMouseUp={handleSeek}
						/>
						<div
							className={styles["video-consumed"]}
							style={{ minWidth: `${consumed * 100}%` }}
						/>
						<div
							className={styles["video-buffered"]}
							style={{ minWidth: `${buffered * 100}%` }}
						/>
					</div>

					{/* control handles */}
					<div className={styles["control-handles"]}>
						{/* play/pause handle */}
						<div>
							<button
								onClick={() =>
									setPlaying((playing) => !playing)
								}>
								{playing ? (
									<BsFillPauseFill />
								) : (
									<BsFillPlayFill />
								)}
							</button>
						</div>

						{/* mute/unmute handle */}
						<div>
							<button
								onClick={() => {
									setMuted((muted) => !muted)
								}}>
								{muted ? (
									<BsVolumeMuteFill />
								) : (
									<BsVolumeUpFill />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
