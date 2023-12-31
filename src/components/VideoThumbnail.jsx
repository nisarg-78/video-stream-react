import styles from "./VideoThumbnail.module.css"

import { Link } from "react-router-dom"

const VideoThumbnail = ({ img, title, id }) => {

	return (
		<div className={styles.video}>
			<div className={styles.thumbnail}>
			<Link to={`/${id}`}>
				<img src={img} alt='' className="thumbnail" />
			</Link>
			</div>
			<div className={styles.title}>{title}</div>
		</div>
	)
}

export default VideoThumbnail