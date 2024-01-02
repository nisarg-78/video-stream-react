import styles from "./Feed.module.css"
import { ENDPOINT, isDev } from "../../urls"
import { useEffect, useState, useContext } from "react"

import { FeedContext } from "../../contexts/FeedContext"

import VideoThumbnail from "../VideoThumbnail/VideoThumbnail"
import Player from "../Player/Player"

export default function Feed() {
	const { tags } = useContext(FeedContext)

	const [feedVideos, setFeedVideos] = useState([])

	useEffect(() => {
		const authenticateUser = async () => {
			// accept the cookie
			const response = await fetch(`${ENDPOINT}/auth/cookie`, {
				credentials: "include",
			})
		}
		authenticateUser()

		fetch(`${ENDPOINT}/videos/all?tags=${tags ? tags : ""}`)
			.then((res) => res.json())
			.then((data) => {
				setFeedVideos(data)
			})
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
				</div>
			)}
		</>
	)
}
