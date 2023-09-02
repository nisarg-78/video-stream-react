import "./App.css"
import { Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Player from "./components/Player"
import Navbar from "./components/Navbar"

function App() {
	return (
		<div className='app-container'>
			<Navbar className='navbar' />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/:id' element={<Player />} />
			</Routes>
		</div>
	)
}

export default App
