import "./LeftBar.css"
import { ENDPOINT } from "../urls"
import { moviesList } from "../urls"
import { useEffect, useState, useContext } from "react"

import { FeedContext } from "../contexts/FeedContext"
import { Link } from "react-router-dom"

export default function Feed() {
	const { tags, updateTags } = useContext(FeedContext)
	const [movies, setMovies] = useState()

	useEffect(() => {
		console.log(ENDPOINT + "/movies/all")
		fetch(ENDPOINT + "/movies/all")
			.then((res) => res.json())
			.then((data) => {
				setMovies(data)
				console.log(data)
			})
			.catch((err) => console.log(err))
	}, [])

	return (
		<div className='left-bar'>
			<div className='logo'>
				<h1>Stream.ts</h1>
				<hr />
			</div>

			<div className='categories'>
				<h3>
					<label htmlFor='tags'>Tags</label>
				</h3>
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
				{/* <hr />
				<h3>
					<label htmlFor='tags'>Movies</label>
				</h3>
				<div>
					<div className='movies'>
						{movies?.map((movie) => (
							<Link
								to={`/${movie.title.replace(/\s/g, "-")}`}
								state={{ title: movie.title, src: movie.link }}>
								<div className='movie' key={movie.link}>
									{movie.title}
								</div>
							</Link>
						))}
					</div>
				</div> */}
			</div>
		</div>
	)
}
