import {
  JsonController, Get, Post, Put, Delete, BadRequestError, Param
} from 'routing-controllers';
import { VideoService } from '../services/video-service';


/**
* Video Controller
*/
@JsonController('/videos')
export class VideoController {
  constructor(private readonly service: VideoService = new VideoService()) { }

  /**
 * Gets specified video and splits into sections
 * in a json format
 * 
 * @url /videos/videoName/group-of-pictures'
 * @param videoName name of the video file
 * @returns  json document of group of pictures data
 */
  @Get('/:videoName/group-of-pictures.json')
  async getVideoJson(@Param('videoName') videoName: string) {
    try {
      return {
        data: []
      }
    }
    catch (error: any) {
      throw new BadRequestError(error);
    }
  }

  /**
   * Gets specified video and splits into sections
   * rederd as grid of videos
   * 
   * @url /videos/videoName/group-of-pictures'
   * @param videoName name of the video file
   * @returns  an array of countries
   */
  @Get('/:videoName.mp4/group-of-pictures')
  async getVideos(@Param('videoName') videoName: string) {
    try {
      return {
        data: []
      }
    }
    catch (error) {
      throw new BadRequestError(error);
    }
  }

  /**
   * Gets specific section of video by index
   * @url /videos/:videoName/group-of-pictures/:groupIndex
   * @param id 
   * @returns  country object
   */
  @Get('/:videoName.mp4/group-of-pictures/:groupIndex.mp4')
  async getVideo(@Param('videoName') videoName: string, @Param('groupIndex') groupIndex: string) {
    try {
      return {
        data: {}
      }
    }
    catch (error: any) {
      throw new BadRequestError(error);
    }
  }
}