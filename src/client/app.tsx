import * as React from "react"
import classnames from "classnames"

import "./global.css"

import { electron } from "./electron"
import { useLiveInfo } from "./lib/api"
import { useShowInfo } from "./lib/show"

import { Splash } from "./splash"
import { Channel } from "./channel"
import { Player } from "./player"
import { Mixcloud } from "./mixcloud"
import { Show } from "./show"
import { Slider, Slide } from "./slider"

import css from "./app.module.css"

const streams = {
	1: "https://stream-relay-geo.ntslive.net/stream?client=NTSWebApp",
	2: "https://stream-relay-geo.ntslive.net/stream2?client=NTSWebApp",
}

type Channel = 1 | 2 | "show"

export function App() {
	const live = useLiveInfo()
	const show = useShowInfo()

	const [index, setIndex] = React.useState<number>(1)
	const [playing, setPlaying] = React.useState<Channel | null>(null)

	React.useEffect(function () {
		live.load()
		electron.on("open", () => live.load())
		electron.on("drop", (_: Event, url: string) => show.load(url))
	}, [])

	function next() {
		setIndex(idx => (idx + 1) % 3)
	}

	return (
		<>
			<Splash hide={!live.loading && !show.loading} />
			<Slider index={index}>
				<Slide>
					<Channel channel={1} info={live.data?.channel1} />
				</Slide>
				<Slide>
					<Channel channel={2} info={live.data?.channel2} />
				</Slide>
				<Slide>
					<Show show={show.data} />
				</Slide>
			</Slider>
			<Player src={streams[1]} playing={playing === 1} />
			<Player src={streams[2]} playing={playing === 2} />
			<Mixcloud show={show.data} playing={playing === "show"} />
		</>
	)
}
