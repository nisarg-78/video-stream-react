import "./Home.css"

import React, { useEffect, useState } from "react"
import { FeedContext } from "../contexts/FeedContext"

import Feed from "./Feed"
import LeftBar from "./LeftBar"
import Navbar from "./Navbar"

import { ENDPOINT } from "../urls"

export default function Home() {
	const [tags, setTags] = useState([])

	useEffect(() => {
		const authenticateUser = async () => {
			console.log("authenticating user")
			await fetch(`${ENDPOINT}/auth/cookie`)
		}
		authenticateUser()
	}, [])

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
			<Navbar className='navbar' />
			<div className='home-container'>
				<LeftBar className='left-bar' />
				<Feed className='feed' />
			</div>
		</FeedContext.Provider>
	)
}
