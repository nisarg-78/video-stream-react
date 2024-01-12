import styles from "./Upload.module.css"
import React, { useState, useRef } from "react"

export default function Upload() {
	const [selectedVideo, setSelectedVideo] = useState(null)
	const [thumbnailFile, setThumbnailFile] = useState(null)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [tags, setTags] = useState([])

	const inputRef = useRef()

	const updateTags = (e) => {
		const isChecked = e.target.checked
		const tagName = e.target.name

		if (isChecked) {
			setTags([...tags, tagName])
		} else {
			setTags(tags.filter((tag) => tag !== tagName))
		}
	}

	const handleVideoSelect = (e) => {
		const file = e.target.files[0]
		if (file) {
			setSelectedVideo(URL.createObjectURL(file))
		}
	}

	const handleRemoveVideo = () => {
		setSelectedVideo(null)
	}

	const handleSubmit = (e) => {
		
	}

	return (
		<form onSubmit={handleSubmit} className={styles["video-form"]}>
			<div className={styles["video-section"]}>
				<div
					className={styles.video}
					onClick={() => selectedVideo || inputRef.current.click()}>
					<div className={styles["video-preview"]}>
						{selectedVideo ? (
							<video controls>
								<source src={selectedVideo} type='video/mp4' />
								Your browser does not support the video tag.
							</video>
						) : (
							"Click to Select Video"
						)}
						<input
							type='file'
							accept='video/*'
							style={{ display: "none" }}
							onChange={handleVideoSelect}
							ref={inputRef}
						/>
					</div>
					{selectedVideo && (
						<button
							onClick={handleRemoveVideo}
							className={styles["remove-video"]}>
							Remove Video
						</button>
					)}
				</div>

				<div className={styles["input-section"]}>
					<div className='title'>
						<div className={styles["text-box"]}>
							<label
								htmlFor='title'
								className={styles["text-label"]}>
								Title
							</label>
							<input
								type='text'
								name='title'
								id='title'
								value={title}
								className={styles["text-input"]}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
					</div>
					<div className={styles["description"]}>
						<div className={styles["text-box"]}>
							<label
								htmlFor='description'
								className={styles["text-label"]}>
								Description
							</label>
							<textarea
								name='description'
								id='description'
								value={description}
								className={styles["text-input"]}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					</div>

					<div className={styles.tags}>
						<div className={styles.tag}>
							<input
								type='checkbox'
								checked={tags.includes("Valorant")}
								onChange={updateTags}
								name='Valorant'
								id='Valorant'
							/>
							<label htmlFor='Valorant'>Valorant</label>
						</div>
						<div className={styles.tag}>
							<input
								type='checkbox'
								checked={tags.includes("Music")}
								onChange={updateTags}
								name='Music'
								id='Music'
							/>
							<label htmlFor='Music'>Music</label>
						</div>
						<div className={styles.tag}>
							<input
								type='checkbox'
								checked={tags.includes("Gaming")}
								onChange={updateTags}
								name='Gaming'
								id='Gaming'
							/>
							<label htmlFor='Gaming'>Gameplay</label>
						</div>
						<div className={styles.tag}>
							<input
								type='checkbox'
								checked={tags.includes("Science")}
								onChange={updateTags}
								name='Science'
								id='Science'
							/>
							<label htmlFor='Science'>Science</label>
						</div>
					</div>
				</div>
			</div>

			<div>
				<button type='submit' className={styles.submit}>
					Upload
				</button>
			</div>
		</form>
	)
}
