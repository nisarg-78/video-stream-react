import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Player from "./components/Player"
import Live from "./components/Live"

function App() {
	const src = "https://video-stream-7f9u.onrender.com/videos/"

	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/live' element={<Live/>} />
			<Route path='/:id' element={<Player src={src} />} />
		</Routes>
	)
}

export default App
