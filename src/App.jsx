import "./App.css"
import { Routes, Route } from "react-router-dom"
import Home from "./components/Home/Home"
import Player from "./components/Player/Player"
import VideoPage from "./components/VideoPage/VideoPage"
import Navbar from "./components/Navbar/Navbar"
import { useState } from "react"
import { PlayerContext } from "./contexts/PlayerContext"

function App() {
	const [playerState, setPlayerState] = useState({})
	const updatePlayerState = (obj) => {
		setPlayerState((prevState) => ({ ...prevState, ...obj }))
	}

	return (
		<div className='app-container'>
			<PlayerContext.Provider value={{ playerState, updatePlayerState }}>
				<Navbar className='navbar' />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/:id' element={<VideoPage />} />
				</Routes>
			</PlayerContext.Provider>
		</div>
	)
}

export default App
