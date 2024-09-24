const isDev = import.meta.env.MODE === "development"

const ENDPOINT = isDev
	? "http://localhost:3000"
	: "https://api.streamts.enth.dev"

const CDN = "https://cdn.enth.dev"

export { ENDPOINT, CDN, isDev }