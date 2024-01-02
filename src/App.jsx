import "./App.css"
import { Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Player from "./components/Player"
import Navbar from "./components/Navbar"
import { useState } from "react"
import { PlayerContext } from "./contexts/PlayerContext"

function App() {
	const [playerState, setPlayerState] = useState({})
	const updatePlayerState = (obj) => {
		console.log(obj)
		setPlayerState((prevState) => ({ ...prevState, ...obj }))
	}

	return (
		<div className='app-container'>
			<PlayerContext.Provider value={{ playerState, updatePlayerState }}>
				<Navbar className='navbar' />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/:id' element={<Player />} />
				</Routes>
			</PlayerContext.Provider>
		</div>
	)
}

export default App
