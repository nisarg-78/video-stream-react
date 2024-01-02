import styles from "./Player.module.css"
import React, { useState, useRef, useEffect, useContext } from "react"
import { PlayerContext } from "../contexts/PlayerContext"

import { useLocation } from "react-router-dom"
import { useParams } from "react-router-dom"
import ReactPlayer from "react-player"

import VideoThumbnail from "./VideoThumbnail"
import { ENDPOINT, CDN, isDev } from "../urls"

import VideoProgress from "./VideoProgress"
import PlayerControls from "./PlayerControls"

export default function Player() {
	const { id } = useParams()
	const location = useLocation()

	const { playerState, updatePlayerState } = useContext(PlayerContext)

	const player = useRef(null)
	const videoWrapper = useRef(null)
	const volumeSlider = useRef(null)
	const playerControls = useRef(null)

	const [src, setSrc] = useState("")
	const [internalPlayer, setInternalPlayer] = useState(null)
	const [videoJson, setVideoJson] = useState(null)
	const [resolutions, setResolutions] = useState(null)
	const [currentResolution, setCurrentResolution] = useState(null)
	const [similarVideos, setSimilarVideos] = useState(null)
	const [playing, setPlaying] = useState(false)
	const [consumed, setConsumed] = useState(0)
	const [buffered, setBuffered] = useState(0)
	const [showControlsTimeout, setShowControlsTimeout] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				// set srouce
				if (isDev) {
					setSrc(
						"https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
					)
				} else {
					const source = location?.state?.src
						? location?.state?.src
						: `${CDN}/videos/${id}/master.m3u8`
					setSrc(source)
				}

				// get video data
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
		const percentVolume = Number(
			localStorage.getItem("percentVolume") || 0.125
		)
		console.log(percentVolume, localStorage.getItem("percentVolume"))
		updatePlayerState({ percentVolume: percentVolume })
		volumeSlider.current.value = percentVolume * 100
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

	return (
		<>
			<div className={styles.parent}>
				<div className={styles["player-wrapper"]} ref={videoWrapper}>
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
						}}
						onReady={onPlayerReady}
						height={"100%"}
						width={"100%"}
						muted={playerState.muted}
						progressInterval={0}
						onProgress={handleProgress}
						playing={playerState.playing}
						volume={playerState.percentVolume}
					/>
					<div
						className={styles["controls-container"]}
						ref={playerControls}>
						{/* progress bar */}
						<VideoProgress
							consumed={consumed}
							buffered={buffered}
							handleSeek={handleSeek}
						/>

						{/* control handles */}
						<PlayerControls
							player={player}
							internalPlayer={internalPlayer}
							videoWrapper={videoWrapper}
							volumeSlider={volumeSlider}
							resolutions={resolutions}
						/>
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
