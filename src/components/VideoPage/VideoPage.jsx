import React, { useState, useEffect } from "react"
import "./VideoPage.css"
import { ENDPOINT } from "../../urls"
import Player from "../Player/Player"
import Suggestions from "../Suggestions/Suggestions"

function VideoPage() {
	const videoId = window.location.pathname.split("/")[1]
	const [videoJson, setVideoJson] = useState({})

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`${ENDPOINT}/videos/info?id=${videoId}`
				)
				const data = await response.json()
				setVideoJson(data[0])
			} catch (err) {
				console.log(err)
			}
		}
		fetchData()
	}, [videoId])

	return (
		<div className={"video-page-container"}>
			<div className='left'>
				<Player videoId={videoId} isThumbnail={false} />

				<div className='info'>
					<div className='name'>
						<div>
							{location?.state?.title
								? location?.state?.title
								: videoJson?.title}{" "}
						</div>
						<div className='date'>
							{videoJson?.date &&
								new Date(videoJson?.date).toDateString()}
						</div>
					</div>
				</div>
			</div>

			<Suggestions tags={videoJson?.tags} videoId={videoId} />
		</div>
	)
}

export default VideoPage
