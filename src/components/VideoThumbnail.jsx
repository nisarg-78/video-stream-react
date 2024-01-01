import styles from "./VideoThumbnail.module.css"
import { isDev } from "../urls"
import { Link } from "react-router-dom"

const VideoThumbnail = ({ img, title, id }) => {
	return (
		<div className={styles.video}>
			<Link to={`/${id}`}>
				<div className={styles.thumbnail}>
					<img
						src={isDev ? "https://source.unsplash.com/random" : img}
						alt=''
					/>
				</div>
			</Link>
			<div className={styles.title} title={title}>
				{title.substring(0, 278)}
				{/* {title.length > 30 ? "..." : ""} */}
			</div>
		</div>
	)
}

export default VideoThumbnail
