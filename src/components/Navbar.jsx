import { Link } from "react-router-dom"
import "./Navbar.css"

export default function Navbar() {
	return (
		<div className='navbar'>
			<div className='logo'>
				<Link to='/'>Stream.ts</Link>
			</div>
			<div className='search'>
				<input type='text' placeholder='Search (not working)' />
			</div>
			<div className='profile'>
				<p>Logged in as Username</p>
			</div>
		</div>
	)
}
