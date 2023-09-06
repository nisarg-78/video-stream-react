const isDev = import.meta.env.MODE === "development"

const ENDPOINT = isDev
	? "http://localhost:3000"
	: "https://video-stream-7f9u.onrender.com"

console.log(ENDPOINT)

export { ENDPOINT }
