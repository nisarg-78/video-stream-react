import React from "react"
import { useState, useEffect, useRef } from "react"
import Hls from "hls.js"

const VideoPlayer = ({ src }) => {
	const playerContainerRef = useRef(null)
	const videoRef = useRef(null)
	const volumeSliderRef = useRef(null)
	const loaderIconRef = useRef(null)
	const videoConsumedBarRef = useRef(null)
	const playerControlsRef = useRef(null)
	const [volumeSliderValue, setVolumeSliderValue] = useState(0)
	const [maxVolume, setMaxVolume] = useState(100)
	const [isMuted, setIsMuted] = useState(false)
	const [resolutions, setResolutions] = useState([])
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [playing, setPlaying] = useState(false)
	const [bufferedTime, setBufferedTime] = useState(0)
	const [playbackTime, setPlaybackTime] = useState(0)
	let hls
	let showControlsTimeout = null
	let duration = 0

	useEffect(() => {
		console.log("src", src)
		if (Hls.isSupported()) {
			hls = new Hls({
				forceKeyFrameOnDiscontinuity: true,
			})
			hls.loadSource(src)
			console.log(hls)
			hls.attachMedia(videoRef)
			hls.enableWorker = true

			//TODO: Add subtitle support
			hls.subtitleDisplay = false

			console.log("Duration:", videoRef.current.duration)
			setPlaybackTime(videoRef.current.duration)

			hls.on(Hls.Events.MEDIA_ATTACHED, function () {})
			hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
				console.log(data.levels)
				for (let i = 0; i < data.levels.length; i++) {
					setResolutions([
						...resolutions,
						[data.levels[i].height, data.levels[i].bitrate],
					])
				}
				console.log(resolutions)
			})

			videoRef.current.addEventListener("progress", function () {
				let buffered = video?.buffered
				if (buffered && buffered.length > 0) {
					setBufferedTime(buffered.end(buffered.length - 1))
				}
			})

			const value = localStorage.getItem("volume")
			setVolumeSliderValue(value)
			setPlaying(true)
			setIsMuted(false)
		}
	}, [src])

	const handlePlay = () => {
		if (!video) return
		if (!playing) {
			setPlaying(true)
			videoRef.current.play()
		} else {
			setPlaying(false)
			videoRef.current.pause()
		}
	}

	const handleWaiting = () => {
		setLoaderIcon(document.createElement("div"))
	}

	const handlePlaying = () => {
		setLoaderIcon(null)
	}

	const handleMouseMove = () => {
		document.body.style.cursor = "auto"
		if (showControlsTimeout) clearTimeout(showControlsTimeout)
		setPlayerControls(document.createElement("div"))
		showControlsTimeout = setTimeout(() => {
			setPlayerControls(null)
			document.body.style.cursor = "none"
		}, 3000)
	}

	const handleVolume = (event) => {
		const volume = event.target.value
		setVolumeSliderValue(volume)
		videoRef.current.volume = volume / maxVolume
		if (volume === 0) setIsMuted(true)
		else setIsMuted(false)
		localStorage.setItem("volume", volume)
	}

	const handleMute = () => {
		if (isMuted) {
			setIsMuted(false)
			videoRef.current.volume = volumeSliderValue / maxVolume
		} else {
			setIsMuted(true)
			videoRef.current.volume = 0
		}
	}

	const handleFullscreen = () => {
		if (isFullscreen) {
			document.exitFullscreen()
			setIsFullscreen(false)
		} else {
			playerContainer.requestFullscreen()
			setIsFullscreen(true)
		}
	}

	const handlePlayback = (event) => {
		const time = event.target.value
		setPlaybackTime(time)
		videoRef.current.currentTime = time
	}

	function handleQaulity(event) {
		if (hls) {
			if (event.target.value === "auto") {
				hls.currentLevel = -1
				return
			}
			const [height, bitrate] = event.target.value.split(",")
			hls.levels.forEach((level, levelIndex) => {
				if (
					level.height === parseInt(height) &&
					level.bitrate === parseInt(bitrate)
				) {
					console.log(hls.levels[levelIndex])
					hls.currentLevel = levelIndex
					console.log(hls.currentLevel)
				}
			})
		}
	}

	const handleTimeUpdate = () => {
		setPlaybackTime(videoRef.current.currentTime)
	}

	const handleProgress = () => {
		let buffered = video?.buffered
		if (buffered && buffered.length > 0) {
			setBufferedTime(buffered.end(buffered.length - 1))
		}
	}

	const handleEnded = () => {
		setPlaying(false)
	}

	return (
		<div className='container'>
			<div
				className='player-container'
				ref={playerContainerRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={() => {
					playerControls.style.opacity = 0
				}}>
				{/* svelte-ignore a11y-media-has-caption */}
				<video
					className='video'
					muted='true'
					ref={videoRef}
					onClick={handlePlay}
					onDoubleClick={handleFullscreen}
					onWaiting={handleWaiting}
					onCanPlay={handlePlaying}
					onPlaying={handlePlaying}
					currentTime={playbackTime}
				/>

				{/* loading icon */}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					xmlnsXlink='http://www.w3.org/1999/xlink'
					style={{
						margin: "auto",
						background: "none",
						display: "block",
						shapeRendering: "auto",
					}}
					width='50px'
					height='50px'
					viewBox='0 0 100 100'
					preserveAspectRatio='xMidYMid'
					className='loader'
					ref={loaderIconRef}>
					<circle
						cx='50'
						cy='50'
						fill='none'
						stroke='maroon'
						strokeWidth='10'
						r='35'
						strokeDasharray='164.93361431346415 56.97787143782138'>
						<animateTransform
							attributeName='transform'
							type='rotate'
							repeatCount='indefinite'
							dur='1s'
							values='0 50 50;360 50 50'
							keyTimes='0;1'
						/>
					</circle>
				</svg>

				<div className='controls' ref={playerControlsRef}>
					{/* svelte-ignore a11y-click-events-have-key-events */}
					<div
						className='video-progress'
						onMouseMove={(e) => handleSeek(e)}
						onClick={(e) => handleSeek(e)}>
						<div className='video-bar' />
						<div
							className='video-consumed'
							ref={videoConsumedBarRef}
							style={{
								minWidth: `${(playbackTime / duration) * 100}%`,
							}}
						/>
						<div
							className='video-buffered'
							style={{
								minWidth: `${(bufferedTime / duration) * 100}%`,
							}}
						/>
					</div>

					<div className='control-handles'>
						{/* play/pause handle  */}
						<div>
							{playing ? (
								<button onClick={handlePlay}>
									<i
										className='fa fa-pause'
										aria-hidden='true'
									/>
								</button>
							) : (
								<button onClick={handlePlay}>
									<i
										className='fa-solid fa-play'
										aria-hidden='true'
									/>
								</button>
							)}
						</div>

						{/* playback time */}
						<div className='progress-time'>
							{/* {new Date(
								Number(Number(playbackTime).toFixed(0)) * 1000
							)
								.toISOString()
								.substring(14, 19)}
							/
							{new Date(duration * 1000)
								.toISOString()
								.substring(14, 19)} */}
						</div>

						{/* volume handle */}
						<div className='volume-handle'>
							{isMuted ? (
								<button onClick={handleMute}>
									<i
										className='fa fa-volume-off'
										aria-hidden='true'
									/>
								</button>
							) : (
								<button onClick={handleMute}>
									<i
										className='fa fa-volume-up'
										aria-hidden='true'
									/>
								</button>
							)}
							<input
								ref={volumeSliderRef}
								type='range'
								onInput={handleVolume}
								id='volume'
								name='volume'
								min='0'
								max={maxVolume}
							/>
						</div>

						{/* quality handle */}
						<div className='resolution-selector'>
							<select
								onChange={handleQaulity}
								name='quality'
								id='quality'>
								{resolutions.map((res) => (
									<option value={res}>{`${res[0]}p (${(
										res[1] /
										1024 /
										1024
									).toFixed(2)}Mbps)`}</option>
								))}
								<option value='auto'>{`Auto ${
									hls?.levels[level]?.height
										? hls?.levels[level]?.height + "p"
										: ""
								}`}</option>
							</select>
						</div>

						{/* fullscreen handle */}
						<div>
							{isFullscreen ? (
								<button onClick={handleFullscreen}>
									<i
										className='fa fa-compress'
										aria-hidden='true'
									/>
								</button>
							) : (
								<button onClick={handleFullscreen}>
									<i
										className='fa fa-expand'
										aria-hidden='true'
									/>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VideoPlayer
