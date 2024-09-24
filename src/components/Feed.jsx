import styles from "./Feed.module.css"
import { ENDPOINT, CDN } from "../urls"
import { useEffect, useState, useContext } from "react"

import { FeedContext } from "../contexts/FeedContext"
import VideoThumbnail from "./VideoThumbnail"

export default function Feed() {
    const { tags } = useContext(FeedContext)
    const [feedVideos, setFeedVideos] = useState([])

    useEffect(() => {
        const authenticateUser = async () => {
            await fetch(`${ENDPOINT}/credentials/cookie`, {
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
                        <li>The server is sleeping, please wait a minute or two.</li>
                        <li>There are no videos with provided tags.</li>
                    </ul>
                </div>
            ) : (
                <div className={styles.videos}>
                    {feedVideos.map((video, _) => (
                        <VideoThumbnail
                            key={video._id}
                            id={video.id}
                            title={video.title}
                            img={CDN + video.thumbnail}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
