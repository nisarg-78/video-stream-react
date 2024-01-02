import styles from "./VideoThumbnail.module.css"
import { isDev } from "../../urls"
import { Link } from "react-router-dom"
import { useState } from "react"
import Player from "../Player/Player"

const VideoThumbnail = ({ img, title, id }) => {
	const [isHovered, setIsHovered] = useState(false)

	const handleMouseEnter = () => {
		setIsHovered(true)
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
	}

	return (
		<div
			className={styles.video}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<Link to={`/${id}`}>
				<div className={styles.thumbnail}>
					{isHovered ? (
						<Player videoId={id} title={title} isThumbnail={true} />
					) : (
						<img
							src={
								isDev
									? "https://source.unsplash.com/random"
									: img
							}
							alt=''
						/>
					)}
				</div>
			</Link>

			<div className={styles.title} title={title}>
				{title.substring(0, 278)}
				{title.length > 30 ? "..." : ""}
			</div>
		</div>
	)
}

export default VideoThumbnail
