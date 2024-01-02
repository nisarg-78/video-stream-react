import styles from "./Player.module.css"
import React, { useState, useRef, useEffect, useContext } from "react"
import { PlayerContext } from "../../contexts/PlayerContext"

import { useLocation } from "react-router-dom"
import { useParams } from "react-router-dom"
import ReactPlayer from "react-player"

import { ENDPOINT, CDN, isDev } from "../../urls"

import VideoProgress from "../VideoProgress/VideoProgress"
import PlayerControls from "../PlayerControls/PlayerControls"
import VideoThumbnail from "../VideoThumbnail/VideoThumbnail"

export default function Player({ videoId, isThumbnail }) {
	const { id } = useParams()
	const location = useLocation()

	const { playerState, updatePlayerState } = useContext(PlayerContext)
	const [isHovered, setIsHovered] = useState(false)
	const player = useRef(null)
	const videoWrapper = useRef(null)
	const volumeSlider = useRef(null)
	const playerControls = useRef(null)

	const [src, setSrc] = useState("")
	const [internalPlayer, setInternalPlayer] = useState(null)
	const [videoJson, setVideoJson] = useState(null)
	const [resolutions, setResolutions] = useState(null)
	const [playing, setPlaying] = useState(false)
	const [consumed, setConsumed] = useState(0)
	const [buffered, setBuffered] = useState(0)

	useEffect(() => {
		const fetchData = async () => {
			try {
				// set srouce
				if (isDev) {
					setSrc(
						"http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8"
					)
				} else {
					const source = location?.state?.src
						? location?.state?.src
						: `${CDN}/videos/${id}/master.m3u8`
					setSrc(source)
				}
			} catch (err) {
				console.log(err)
			}
		}
		fetchData()

		// update the volume
		if (!isThumbnail) {
			const percentVolume = Number(
				localStorage.getItem("percentVolume") || 0.125
			)
			updatePlayerState({ percentVolume: percentVolume })
			volumeSlider.current.value = percentVolume * 100
			
		} else {
			updatePlayerState({ playingThumbnail: true, mutedThumbnail: true })
		}

	}, [id])

	function onPlayerReady() {
		// get the internal player
		const internalHlsPlayer = player.current.getInternalPlayer("hls")
		setInternalPlayer(internalHlsPlayer)

		// set video quality levels
		let resolutions = []
		internalHlsPlayer.levels.forEach((level, index) => {
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

	const playerJsx = (
		<ReactPlayer
			ref={player}
			className={styles["react-player"]}
			url={src}
			config={{
				file: {
					hlsOptions: {
						xhrSetup: function (xhr, url) {
							xhr.withCredentials = isDev ? false : true // send cookies
						},
					},
				},
			}}
			onReady={onPlayerReady}
			height={"100%"}
			width={"100%"}
			muted={isThumbnail ? playerState.mutedThumbnail : playerState.muted}
			progressInterval={1}
			onProgress={handleProgress}
			playing={isThumbnail ? playerState.playingThumbnail : playerState.playing}
			volume={playerState.percentVolume}
		/>
	)

	const controlsJsx = (
		<div className={styles["controls-container"]} ref={playerControls}>
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
	)

	return (
		<>
			<div
				className={styles.parent}>
				{/* video player */}
				<div
					className={styles["player-wrapper"]}
					ref={videoWrapper}
					onClick={() => {
						if (!isThumbnail)
							updatePlayerState({ playing: !playerState.playing })
						else {
							window.location.href = `/${videoId}`
						}
					}}>
					{isThumbnail ? (
						playerJsx
					) : (
						<>
							{playerJsx}
							{controlsJsx}
						</>
					)}
				</div>
			</div>
		</>
	)
}
