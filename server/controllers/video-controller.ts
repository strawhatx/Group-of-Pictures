import {
  JsonController, Get, Render, BadRequestError, Param
} from 'routing-controllers';
import { VideoService } from '../services/video-service';


/**
* Video Controller
*/
@JsonController('/videos')
export class VideoController {
  constructor() { }

  /**
 * This endpoint should respond with JSON encoded data 
 * showing details of all the I frames in a video.
 * 
 * @url /videos/videoName/group-of-pictures'
 * @param videoName name of the video file
 * @returns  json document of group of pictures data
 */
  @Get('/')
  async getVideoBase() {
    return { test: "data" }
  }

  /**
 * This endpoint should respond with JSON encoded data 
 * showing details of all the I frames in a video.
 * 
 * @url /videos/videoName/group-of-pictures'
 * @param videoName name of the video file
 * @returns  json document of group of pictures data
 */
  @Get('/:videoName/group-of-pictures.json')
  async getVideoJsonData(@Param('videoName') videoName: string) {
    try {
      // call the cmd service to pull oout the frame data as json
      var json = await new VideoService(videoName).GetIFrameInJson();

      return {
        json
      }
    }
    catch (error: any) {
      throw new BadRequestError(error);
    }
  }

  /**
   * Gets specified video and splits into sections
   * renderd as grid of videos
   * 
   * @url /videos/:videoName.mp4/group-of-pictures
   * @param videoName name of the video file
   * @returns  an array of countries
   */
  @Get('/:videoName/group-of-pictures')
  @Render("videos.jade")
  async getVideos(@Param('videoName') videoName: string) {
    try {
      const gridData = await new VideoService(videoName).GetGridData()

      return {
        gridData
      }
    }
    catch (error: any) {
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