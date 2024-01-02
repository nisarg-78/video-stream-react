import React, { useState, useContext } from "react"
import styles from "./PlayerControls.module.css"
import { PlayerContext } from "../../contexts/PlayerContext"
import {
	BsFillPauseFill,
	BsFillPlayFill,
	BsVolumeUpFill,
	BsVolumeMuteFill,
} from "react-icons/bs"
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai"

function PlayerControls({
	player,
	internalPlayer,
	videoWrapper,
	handleQuality,
	volumeSlider,
	resolutions,
}) {
	const { playerState, updatePlayerState } = useContext(PlayerContext)

	const [isFullscreen, setIsFullscreen] = useState(false)

	function formatTime(time) {
		if (isNaN(time)) return "00:00:00"

		const hours = Math.floor(time / 3600)
		const minutes = Math.floor((time % 3600) / 60)
		const seconds = Math.floor(time % 60)

		const formattedHours = hours > 9 ? hours : `0${hours}`
		const formattedMinutes = minutes > 9 ? minutes : `0${minutes}`
		const formattedSeconds = seconds > 9 ? seconds : `0${seconds}`

		if (hours > 0) {
			return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
		} else {
			return `${formattedMinutes}:${formattedSeconds}`
		}
	}

	function handleFullscreen() {
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

	const maxVolume = 100
	function throttle(func, delay) {
		let timer = null
		return function (...args) {
			if (!timer) {
				func.apply(this, args)
				timer = setTimeout(() => {
					timer = null
				}, delay)
			}
		}
	}
	const throttledHandleVolume = throttle(handleVolume, 200)

	function handleVolume(event) {
		const inputValue = event.target.value || event
		const volume = inputValue / maxVolume
		updatePlayerState({ percentVolume: volume, muted: volume === 0 })
		localStorage.setItem("percentVolume", volume)
	}

	function handleQuality(event) {
		if (event.target.value === "auto") {
			internalPlayer.currentLevel = -1
			updatePlayerState({
				resolutionHeight: "auto",
			})
		} else {
			let [height, bitrate] = event.target.value.split(",")
			height = parseInt(height)
			bitrate = parseInt(bitrate)

			internalPlayer.levels.forEach((level, levelIndex) => {
				if (level.height === height && level.bitrate === bitrate) {
					internalPlayer.currentLevel = levelIndex
					updatePlayerState({
						resolutionHeight:
							internalPlayer.levels[levelIndex].height,
					})
				}
			})
		}
	}

	return (
		<>
			<div
				className={styles["control-handles"]}
				onClick={(event) => {
					event.stopPropagation()
				}}>
				{/* play/pause handle */}
				<div>
					<button
						onClick={() => {
							updatePlayerState({ playing: !playerState.playing })
						}}>
						{playerState.playing ? (
							<BsFillPauseFill />
						) : (
							<BsFillPlayFill />
						)}
					</button>
				</div>

				{/* video time */}
				{player?.current?.getCurrentTime() !== 0 && (
					<div className={styles["video-time"]}>
						{formatTime(player?.current?.getCurrentTime())}/
						{formatTime(player?.current?.getDuration())}
					</div>
				)}

				{/* mute/unmute handle */}
				<div className={styles["volume"]}>
					<button
						onClick={() => {
							updatePlayerState({ muted: !playerState.muted })
						}}>
						{playerState.muted ? (
							<BsVolumeMuteFill />
						) : (
							<BsVolumeUpFill />
						)}
					</button>
					<input
						type='range'
						ref={volumeSlider}
						onInput={throttledHandleVolume}
						id='volume'
						name='volume'
						min='0'
						max={maxVolume}
					/>
				</div>

				<div className={styles["left"]}>
					{/* quality selector */}
					<div className={styles["resolution-selector"]}>
						<select
							onChange={handleQuality}
							name='quality'
							id='quality'>
							{resolutions?.map((res) => (
								<option value={res} key={res[1]}>
									{res[0]}p (
									{(res[1] / 1024 / 1024).toFixed(2)}
									Mbps)
								</option>
							))}
							<option value='auto'>Auto </option>
						</select>
					</div>

					{/* fullscreen handle */}
					<div className={styles.fullscreen}>
						<button onClick={handleFullscreen}>
							{isFullscreen ? (
								<AiOutlineFullscreenExit />
							) : (
								<AiOutlineFullscreen />
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default PlayerControls
