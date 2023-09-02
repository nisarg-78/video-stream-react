import styles from "./Feed.module.css"
import { ENDPOINT } from "../urls"
import { useEffect, useState, useContext } from "react"

import { FeedContext } from "../contexts/FeedContext"

import VideoThumbnail from "./VideoThumbnail"

export default function Feed() {
	const { tags } = useContext(FeedContext)

	const [feedVideos, setFeedVideos] = useState([])

	useEffect(() => {
		fetch(`${ENDPOINT}/videos/all?tags=${tags ? tags : ""}`)
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
			{feedVideos.length === 0 ? (
				<div className={styles.error}>
					No Videos Found, reasons could be:
					<ul>
						<li>
							The server is sleeping, please wait a minute or two.
						</li>
						<li>There are no videos with provided tags.</li>
					</ul>
				</div>
			) : (
				<div className={styles.videos}>
					{feedVideos.map((video, index) => (
						<VideoThumbnail
							key={video._id}
							id={video.id}
							title={video.title}
							img={video.thumbnail}
						/>
					))}
					{feedVideos.map((video, index) => (
						<VideoThumbnail
							key={video._id}
							id={video.id}
							title={video.title}
							img={video.thumbnail}
						/>
					))}
				</div>
			)}
		</>
	)
}
