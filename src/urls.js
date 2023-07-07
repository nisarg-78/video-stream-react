const isDev = import.meta.env.MODE === "development"

const ENDPOINT = isDev
	? "http://localhost:3000"
	: "https://video-stream-7f9u.onrender.com"

console.log(ENDPOINT)

const moviesList = [{
	id: "ShubhYatra",
	name: "Shubh Yatra",
	url: "https://d1fcqrzxghru70.cloudfront.net/shemaroo-vod/altplatform/64a5ae068530b83c94a851e9/laptop_paid_us_playlist.m3u8?hdnts=st=1688741685~exp=1688752485~acl=*~data=testdata~hmac=8a02e214bc80618fb84cbc386b9f48c17c0da8f4499b8b0f52e3eb4813124860"
}
,
{
	id: "ChalManJeetvaJaiye2",
	name: "Chal Man Jeetva Jaiye 2",
	url: "https://d1fcqrzxghru70.cloudfront.net/shemaroo-vod/altplatform/64670f4d8530b83c94a8275f/laptop_paid_us_playlist.m3u8?hdnts=st=1688746824~exp=1688757624~acl=*~data=testdata~hmac=07febdac7cfd4fa509de72b407a4281026ac916a7afdd7b7f590bb8e59130e20"
}
]

export { ENDPOINT, moviesList }
