import styles from "./Feed.module.css"

import { useEffect, useState, useContext } from "react"

import { FeedContext } from "../contexts/FeedContext"

import VideoThumbnail from "./VideoThumbnail"

export default function Feed() {
	const { tags } = useContext(FeedContext)

	const [feedVideos, setFeedVideos] = useState([])

	useEffect(() => {
		fetch(
			"http://127.0.0.1:3000/videos/all?tags=" +
			// "https://video-stream-7f9u.onrender.com/videos/all?tags=" +
				(tags ? tags : "")
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
				setFeedVideos(data)
			})
		console.log("Feed mounted")
		return () => {
			console.log("Feed unmounted")
		}
	}, [tags])

	return (
		<>
			<div className={styles.videos}>
				{feedVideos.map((video, index) => (
					<VideoThumbnail
						key={video._id}
						id={video.id}
						title={video.title}
						img={video.thumbnail}
					/>
				))}
			</div>
		</>
	)
}
