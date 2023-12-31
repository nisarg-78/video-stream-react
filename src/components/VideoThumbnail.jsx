import styles from "./VideoThumbnail.module.css"

import { Link } from "react-router-dom"

const VideoThumbnail = ({ img, title, id }) => {
	return (
		<div className={styles.video}>
			<Link to={`/${id}`}>
				<div className={styles.thumbnail}>
					<img
						src={img}
						alt=''
						className='thumbnail'
					/>
				</div>
			</Link>
			<div className={styles.title} title={title}>
				{title.substring(0, 27)}
				{title.length > 30 ? "..." : ""}
			</div>
		</div>
	)
}

export default VideoThumbnail
