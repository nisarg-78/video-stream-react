import { Routes, Route, useParams } from "react-router-dom"
import VideoPlayer from "./components/VideoPlayer"
import Home from "./components/Home"

function App() {
	const { id } = useParams()
  const src = 'https://video-stream-7f9u.onrender.com/videos/' + id;

	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/:id' element={<VideoPlayer src={src} />} />
		</Routes>
	)
}

export default App
