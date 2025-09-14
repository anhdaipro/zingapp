// react-native-track-player.d.ts
import { EmitterSubscription } from 'react-native';

// declare module 'react-native-track-player' {
//   export default class TrackPlayer {
//     static setupPlayer(options?: { waitForBuffer?: boolean }): Promise<void>;
//     static updateOptions(options: {
//       capabilities?: Capability[];
//       compactCapabilities?: Capability[];
//       notificationCapabilities?: Capability[];
//       icon?: string[];
//       playIcon?: string[];
//       pauseIcon?: string[];
//       stopIcon?: string[];
//       previousIcon?: string[];
//       nextIcon?: string[];
//       stopWithApp?: boolean;
//       alwaysPauseOnInterruption?: boolean;
//     }): Promise<void>;
//     static add(tracks: Track[]): Promise<void>;
//     static play(): Promise<void>;
//     static pause(): Promise<void>;
//     static stop(): Promise<void>;
//     static skipToNext(): Promise<void>;
//     static skipToPrevious(): Promise<void>;
//     static registerPlaybackService(service: () => void): void;
//     static addEventListener(event: string, listener: (data: any) => void): EmitterSubscription;
//   }

//   export enum Capability {
//     PLAY = 'play',
//     PAUSE = 'pause',
//     STOP = 'stop',
//     SKIP_TO_NEXT = 'skipToNext',
//     SKIP_TO_PREVIOUS = 'skipToPrevious',
//     // Thêm các capability khác nếu cần
//   }

//   export interface Track {
//     id: string;
//     url: string;
//     title?: string;
//     artist?: string;
//     artwork?: string;
//     // Thêm các thuộc tính khác của track nếu cần
//   }
// }