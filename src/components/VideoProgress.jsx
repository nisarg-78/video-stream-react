import React from "react"
import styles from "./VideoProgress.module.css"

function VideoProgress({ consumed, buffered, handleSeek }) {
	return (
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
	)
}

export default VideoProgress
