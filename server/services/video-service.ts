'use strict';
import { exec } from "child_process";

export interface IVideoService {
  getVideoInfo: (videoPath: string,) => void;
}

export class VideoService implements IVideoService {
  getVideoInfo = (videoPath: string) => {
    try {
      return {};
    } catch (error) {
      throw error;
    }
  }
}



