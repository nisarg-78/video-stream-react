import styles from "./VideoPlayer.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faExpand, faCompress, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
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
	const [isMuted, setIsMuted] = useState(false)
	const [resolutions, setResolutions] = useState([])
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [playing, setPlaying] = useState(false)
	let playbackTime = 0
	let bufferedTime = 0
	let maxVolume = 100
	let hls
	let showControlsTimeout = null
	let duration = hls && playbackTime ? video.duration : 0;

	useEffect(() => {
		src = "https://video-stream-7f9u.onrender.com/videos/valoMusic"
		if (Hls.isSupported()) {
			hls = new Hls({
				forceKeyFrameOnDiscontinuity: true,
			})
			hls.loadSource(src)
			console.log(hls)
			hls.attachMedia(videoRef.current)
			hls.enableWorker = true

			//TODO: Add subtitle support
			hls.subtitleDisplay = false

			console.log("Duration:", videoRef.current.duration)
			playbackTime = videoRef.current.duration

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
				let buffered = videoRef?.current?.buffered
				if (buffered && buffered.length > 0) {
					bufferedTime = buffered.end(buffered.length - 1)
				}
			})

			duration = hls && playbackTime ? video.duration : 0;
			const value = localStorage.getItem("volume")
			setVolumeSliderValue(value)
			videoRef.current.play()
			videoRef.current.muted = false
			setPlaying(true)
		}
	}, [src])

	const handlePlay = () => {
		if (!videoRef.current) return
		if (!playing) {
			setPlaying(true)
			videoRef.current.play()
		} else {
			setPlaying(false)
			videoRef.current.pause()
		}
	}

	const handleWaiting = () => {
		loaderIconRef.current.style.display = 'block';
	}

	const handlePlaying = () => {
		loaderIconRef.current.style.display = 'none';
	}

	const handleMouseMove = () => {
		document.body.style.cursor = "auto"
		if (showControlsTimeout) clearTimeout(showControlsTimeout)
		playerControlsRef.current.style.opacity = 1
		showControlsTimeout = setTimeout(() => {
			playerControlsRef.current.style.opacity = 0
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
			playerContainerRef.current.requestFullscreen()
			setIsFullscreen(true)
		}
	}

	const handlePlayback = (event) => {
		const time = event.target.value
		playbackTime = time
		console.log(videoRef)
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
		playbackTime = videoRef.current.currentTime
	}

	function handleSeek(event) {
		if (event.type === 'click') {
			const newTime = (event.offsetX / event.target.offsetWidth) * duration;
			console.log(duration)
			videoRef.current.currentTime = newTime;
			playbackTime = newTime;
			videoRef.current.play();
		}
		if (event.type === 'mousemove') {
			if (event.buttons !== 1) return;
			videoConsumedBarRef.current.style.transform = 'scaleX(1)';
			const newTime = (event.offsetX / event.target.offsetWidth) * duration;
			videoRef.current.currentTime = newTime;
			playbackTime = newTime;
			videoRef.current.pause();
		}
	}

	const handleProgress = () => {
		let buffered = video?.current.buffered
		if (buffered && buffered.length > 0) {
			bufferedTime = buffered.end(buffered.length - 1)
		}
	}

	const handleEnded = () => {
		setPlaying(false)
	}

	return (
		<div className={styles.container}>
			<div
				className={styles['player-container']}
				ref={playerContainerRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={() => {
					playerControlsRef.current.style.opacity = 0
				}}>
				<video
					className={styles.video}
					muted={true}
					ref={videoRef}
					onClick={handlePlay}
					onDoubleClick={handleFullscreen}
					onWaiting={handleWaiting}
					onCanPlay={handlePlaying}
					onPlaying={handlePlaying}
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
					className={styles.loader}
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

				<div className={styles.controls} ref={playerControlsRef}>
					<div
						className={styles['video-progress']}
						onMouseMove={(e) => handleSeek(e)}
						onClick={(e) => handleSeek(e)}>
						<div className={styles['video-bar']} />
						<div
							className={styles['video-consumed']}
							ref={videoConsumedBarRef}
							style={{
								minWidth: `${(playbackTime / duration) * 100}%`,
							}}
						/>
						<div
							className={styles['video-buffered']}
							style={{
								minWidth: `${(bufferedTime / duration) * 100}%`,
							}}
						/>
					</div>

					<div className={styles['control-handles']}>
						{/* play/pause handle  */}
						<div>
							{playing ? (
								<button onClick={handlePlay}>
									<FontAwesomeIcon icon={faPause} />
								</button>
							) : (
								<button onClick={handlePlay}>
									<FontAwesomeIcon icon={faPlay} />
								</button>
							)}
						</div>

						{/* playback time */}
						<div className={styles['progress-time']}>
							{new Date(
								Number(Number(playbackTime).toFixed(0)) * 1000
							)
								.toISOString()
								.substring(14, 19)}
							/
							{new Date(duration * 1000)
								.toISOString()
								.substring(14, 19)}
						</div>

						{/* volume handle */}
						<div className={styles['volume-handle']}>
							{isMuted ? (
								<button onClick={handleMute}>
									<FontAwesomeIcon icon={faVolumeMute} />
								</button>
							) : (
								<button onClick={handleMute}>
									<FontAwesomeIcon icon={faVolumeUp} />
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
						<div className={styles['resolution-selector']}>
							<select
								onChange={handleQaulity}
								name='quality'
								id='quality'>
								{resolutions.map((res, index) => (
									<option key={index} value={res}>{`${res[0]}p (${(res[1] / 1024 / 1024).toFixed(2)}Mbps)`}</option>
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
									<FontAwesomeIcon icon={faCompress} />
								</button>
							) : (
								<button onClick={handleFullscreen}>
									<FontAwesomeIcon icon={faExpand} />
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
