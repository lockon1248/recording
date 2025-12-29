declare module 'mic-recorder-to-mp3' {
  type Mp3Data = [ArrayBuffer, Blob]

  export default class MicRecorder {
    constructor(options?: { bitRate?: number })
    start(): Promise<void>
    stop(): {
      getMp3(): Promise<Mp3Data>
    }
  }
}
