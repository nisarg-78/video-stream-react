import "./LeftBar.css"
import { useEffect, useState, useContext } from "react"

import { FeedContext } from "../contexts/FeedContext"
import { Link } from "react-router-dom"
import Live from "./Live"

export default function Feed() {
	const { tags, updateTags } = useContext(FeedContext)

	return (
		<div className='left-bar'>
			<div className='go-live'>
				<Link to='/live'>
					<button>Go Live</button>
				</Link>
			</div>

			<div className='categories'>
				<h1>
					<label htmlFor='tags'>Tags</label>
				</h1>
				<div className='tags'>
					<div className='tag'>
						<input
							type='checkbox'
							checked={tags.includes("Valorant")}
							onChange={updateTags}
							name='Valorant'
							id='Valorant'
						/>
						<label htmlFor='Valorant'>Valorant</label>
					</div>
					<div className='tag'>
						<input
							type='checkbox'
							checked={tags.includes("Music")}
							onChange={updateTags}
							name='Music'
							id='Music'
						/>
						<label htmlFor='Music'>Music</label>
					</div>
					<div className='tag'>
						<input
							type='checkbox'
							checked={tags.includes("Gaming")}
							onChange={updateTags}
							name='Gaming'
							id='Gaming'
						/>
						<label htmlFor='Gaming'>Gameplay</label>
					</div>
					<div className='tag'>
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
	)
}
