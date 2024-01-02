import React, { useState, useEffect } from "react"
import { ENDPOINT } from "../../urls"
import VideoThumbnail from "../VideoThumbnail/VideoThumbnail"
import styles from "./Suggestions.module.css"
function Suggestions({ tags = ['Music'], videoId }) {
	const [similarVideos, setSimilarVideos] = useState(null)

	useEffect(() => {
		console.log(tags)
		const fetchData = async () => {
			try {
				const res = await fetch(
					`${ENDPOINT}/videos/all?tags=${tags?.join(",")}`
				)
				const similarVideos = await res.json()
				if (similarVideos[0]) {
					setSimilarVideos(similarVideos)
					console.log(similarVideos)
				}
			} catch (err) {
				console.log(err)
			}
		}
		fetchData()
	}, [])

	return (
		<>
			{/* suggestions */}
			<div className={styles.suggestions}>
				<div className={styles["suggestions-list"]}>
					{similarVideos &&
						similarVideos.map(
							(video, index) =>
								video.id != videoId && (
									<div
										key={video._id}
										className={styles["suggested-video"]}>
										<VideoThumbnail
											key={video._id}
											id={video.id}
											title={video.title}
											img={video.thumbnail}
										/>
									</div>
								)
						)}
				</div>
			</div>
		</>
	)
}

export default Suggestions
