'use strict';
import ffmpeg from "ffmpeg";

export interface IVideoService {
  getVideoInfo: (videoName: string,) => void;
}

export class VideoService implements IVideoService {
  getVideoInfo = (inputPath: string) => {
    try {
      const videoInfo = ffmpeg.ffprobe(inputPath)

      const { duration, size } = videoInfo.format;

      return {
        size,
        durationInSeconds: Math.floor(duration),
      };
    } catch (error) {
      throw error;
    }
  }
}



