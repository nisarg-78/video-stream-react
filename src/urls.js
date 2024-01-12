const isDev = import.meta.env.MODE === "development"

const ENDPOINT = isDev
	? "http://localhost:3000"
	: "https://api.streamts.tech"

const CDN = "https://cdn.streamts.tech"

export { ENDPOINT, CDN, isDev }