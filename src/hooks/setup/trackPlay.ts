
import TrackPlayer, { Capability, RatingType, RepeatMode } from 'react-native-track-player'
export const setupPlayer = async () => {
	await TrackPlayer.setupPlayer({
		maxCacheSize: 1024 * 10,
	})

	await TrackPlayer.updateOptions({
		ratingType: RatingType.Heart,
		capabilities: [
			Capability.Play,
			Capability.Pause,
			Capability.SkipToNext,
			Capability.SkipToPrevious,
			Capability.Stop,
		],
	})

	await TrackPlayer.setVolume(0.3) // not too loud
	await TrackPlayer.setRepeatMode(RepeatMode.Queue)
}
