import styles from "./VideoThumbnail.module.css"

import { Link } from "react-router-dom"

const VideoThumbnail = ({ img, title, id }) => {

	const path = `/${id}`
	console.log(path)

	return (
		<div className={styles.video}>
			<div className={styles.thumbnail}>
			<Link to={path}>
				<img src={img} alt='' />
			</Link>
			</div>
			<div className={styles.title}>{title}</div>
		</div>
	)
}

export default VideoThumbnail