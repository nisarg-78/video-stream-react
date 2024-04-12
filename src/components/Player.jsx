import styles from "./Player.module.css"
import { ENDPOINT, CDN, isDev } from "../urls"
import VideoThumbnail from "./VideoThumbnail"
import React, { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useParams } from "react-router-dom"
import ReactPlayer from "react-player"
import {
	BsFillPauseFill,
	BsFillPlayFill,
	BsVolumeUpFill,
	BsVolumeMuteFill,
} from "react-icons/bs"
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai"

export default function Player() {
	const { id } = useParams()
	const location = useLocation()

	const player = useRef(null)
	const videoWrapper = useRef(null)
	const volumeSlider = useRef(null)
	const playerControls = useRef(null)

	const [src, setSrc] = useState("")
	const [caption, setCaption] = useState(false)
	const [internalPlayer, setInternalPlayer] = useState(null)
	const [videoJson, setVideoJson] = useState(null)
	const [resolutions, setResolutions] = useState(null)
	const [currentResolution, setCurrentResolution] = useState(null)
	const [similarVideos, setSimilarVideos] = useState(null)
	const [playing, setPlaying] = useState(false)
	const [muted, setMuted] = useState(false)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [duration, setDuration] = useState(null)
	const [consumed, setConsumed] = useState(0)
	const [buffered, setBuffered] = useState(0)
	const [maxVolume, setMaxVolume] = useState(100)
	const [reactPlayerVolume, setReactPlayerVolume] = useState(0)
	const [showControlsTimeout, setShowControlsTimeout] = useState(null)

	useEffect(() => {
		// fetch video data and similar videos
		const fetchData = async () => {
			try {
				const source = location?.state?.src
					? location?.state?.src
					: `${CDN}/videos/${id}/master.m3u8`
				setSrc(source)
				if (isDev) {
					setSrc(
						"https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
					)
				}

				const response = await fetch(`${ENDPOINT}/videos/info?id=${id}`)
				const data = await response.json()
				if (data[0]) {
					setVideoJson(data[0])

					const similarVideosResponse = await fetch(
						`${ENDPOINT}/videos/all?tags=${data[0]?.tags?.join(
							","
						)}`
					)
					const similarVideosData = await similarVideosResponse.json()

					if (similarVideosData[0]) {
						setSimilarVideos(similarVideosData)
					}
				}
			} catch (err) {
				console.log(err)
			}
		}
		fetchData()

		// update the volume
		const precentVolume = parseFloat(
			localStorage.getItem("precentVolume") || 0.125
		)
		setReactPlayerVolume(precentVolume)

		// update the volume slider
		volumeSlider.current.value = precentVolume * 100
	}, [id])

	function onPlayerReady() {
		// start playing the video
		setPlaying(true)

		// get the internal player
		const internalPlayer = player.current.getInternalPlayer("hls")
		setInternalPlayer(internalPlayer)

		// set video quality levels
		let resolutions = []
		internalPlayer.levels.forEach((level, index) => {
			resolutions = [...resolutions, [level.height, level.bitrate]]
		})
		setResolutions(resolutions)
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
		if (playing) {
			setPlaying(true)
		} else {
			setPlaying(false)
		}
	}

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

	// show controls when video is paused and hide when video is playing
	function handlePausePause() {
		if (window.innerWidth > 768) return
		if (playing) {
			playerControls.current.style.opacity = 0
		} else {
			playerControls.current.style.opacity = 1
		}
	}

	function handleVolume(event) {
		const inputValue = event.target.value || event
		const precentVolume = inputValue / maxVolume
		setReactPlayerVolume(precentVolume)
		if (volume === 0) setMuted(true)
		else setMuted(false)
		localStorage.setItem("precentVolume", precentVolume)
		if (showControlsTimeout) clearTimeout(showControlsTimeout)
	}

	function handleQuality(event) {
		console.log(event.target.value)

		if (event.target.value === "auto") {
			internalPlayer.currentLevel = -1
			const level = internalPlayer.currentLevel
			setCurrentResolution(internalPlayer.levels[level].height)
			return
		}
		let [height, bitrate] = event.target.value.split(",")
		height = parseInt(height)
		bitrate = parseInt(bitrate)

		internalPlayer.levels.forEach((level, levelIndex) => {
			if (level.height === height && level.bitrate === bitrate) {
				internalPlayer.currentLevel = levelIndex
				setCurrentResolution(internalPlayer.levels[levelIndex].height)
			}
		})
	}

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

	return (
		<>
			<div className={styles.parent}>
				{/* player */}
				<div
					className={styles["player-wrapper"]}
					ref={videoWrapper}
					onDoubleClick={handleFullscreen}
					// onMouseMove={handleMouseMove}
					// onMouseOut={handleMouseLeave}
				>
					<ReactPlayer
						ref={player}
						className={styles["react-player"]}
						url={src}
						config={{
							file: {
								hlsOptions: {
									xhrSetup: function (xhr, url) {
										xhr.withCredentials = isDev
											? false
											: true // send cookies
									},
								},
							},
							bufferConfig: { bufferAhead: 5 },
						}}
						onReady={onPlayerReady}
						height={"100%"}
						width={"100%"}
						volume={reactPlayerVolume}
						muted={muted}
						progressInterval={0}
						onClick={() => setPlaying((playing) => !playing)}
						playing={playing}
						onPlay={() => {
							setPlaying(true)
							handlePausePause()
						}}
						onPause={() => {
							setPlaying(false)
							handlePausePause()
						}}
						onProgress={handleProgress}
					/>
					<div
						className={styles["controls-container"]}
						ref={playerControls}>
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

							{/* video time */}
							{player?.current?.getCurrentTime() !== 0 && (
								<div className={styles["video-time"]}>
									{formatTime(
										player?.current?.getCurrentTime()
									)}
									/
									{formatTime(player?.current?.getDuration())}
								</div>
							)}

							{/* mute/unmute handle */}
							<div className={styles["volume"]}>
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
												{(res[1] / 1024 / 1024).toFixed(
													2
												)}
												Mbps)
											</option>
										))}
										<option value='auto'>Auto </option>
									</select>
								</div>
								{/* caption button */}
								{/* <div className={styles["caption-button"]}>
									<button
										onClick={() => {
											setCaption((caption) => !caption)
										}}>
										{caption ? "CC" : "CC"}
									</button>
								</div> */}

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
					</div>
				</div>

				{/* video title and description */}
				<div className={styles.info}>
					<div className={styles.name}>
						<div>
							{location?.state?.title
								? location?.state?.title
								: videoJson?.title}
						</div>
						<div className={styles.date}>
							{videoJson?.date &&
								new Date(videoJson?.date).toDateString()}
						</div>
					</div>
				</div>

				{/* suggestions */}
				<div className={styles.suggestions}>
					<div className={styles["suggestions-list"]}>
						{similarVideos &&
							similarVideos.map(
								(video, index) =>
									video.id != videoJson.id && (
										<div
											key={video._id}
											className={
												styles["suggested-video"]
											}>
											<VideoThumbnail
												key={video._id}
												id={video.id}
												title={video.title}
												img={video.thumbnail}
											/>
										</div>
									)
							)}
					</div>
				</div>
			</div>
		</>
	)
}
