import "./Home.css"

import React, { useState } from "react"
import { FeedContext } from "../contexts/FeedContext"

import Feed from "./Feed"
import LeftBar from "./LeftBar"

export default function Home() {
	const [tags, setTags] = useState([])

	const updateTags = (e) => {
		const isChecked = e.target.checked
		const tagName = e.target.name

		if (isChecked) {
			setTags([...tags, tagName])
		} else {
			setTags(tags.filter((tag) => tag !== tagName))
		}
	}

	return (
		<FeedContext.Provider value={{ tags, updateTags }}>
			<div className='home-container'>
				<LeftBar className='left-bar' />
				<Feed className='feed' />
			</div>
		</FeedContext.Provider>
	)
}
