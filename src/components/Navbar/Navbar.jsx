import { Link } from "react-router-dom"
import "./Navbar.css"
import logo from "../../assets/logo-no-background.png"

export default function Navbar() {
	async function requestCookies() {
		const c = await fetch("http://localhost:3000/auth/cookie")
		console.log(c)
	}

	return (
		<div className='navbar'>
			<div className='logo'>
				<Link to='/'>
					<img src={logo} />
				</Link>
			</div>
			{/* <div className='search'>
				<input type='text' placeholder='' />
			</div>
			<div className='profile'>
				<p>Logged in as Username</p>
			</div> */}
			{/* <div className='cookie'>
				<button onClick={requestCookies}>Request Cookies</button>
			</div> */}
		</div>
	)
}
