import { Router, Response } from "express"
import { VideoService } from '../services/video-service';

let router = Router();

/**
 * This endpoint should respond with JSON encoded data 
 * showing details of all the I frames in a video.
 * 
 * @url /videos/videoId/group-of-pictures.json'
 * @param videoName name of the video file
 * @returns json document of group of pictures data
 */
router.get('/:videoId/group-of-pictures.json', async function (req, res, next) {
  try {
    // call the cmd service to pull oout the frame data as json
    var json = await new VideoService(req.params.videoId).GetIFrameInJson();

    res.send(json);
  }
  catch (error: any) {
    next(error);
  }
});

/**
   * Gets specific section of video by index
   * @url /videos/:videoName/group-of-pictures/:groupIndex
   * @param :videoName
   * @param :groupIndex
   * @returns single video
   */
router.get('/:videoName/group-of-pictures/:groupIndex.mp4', async (req, res, next) => {
  try {

    await new VideoService(req.params.videoName).GetFrameViewDataByIndex(+req.params.groupIndex, res);
  } catch (e) {
    console.log('ERROR IN GET CLIP: ', e);
    next(e);
  }
});

/**
   * Gets specified video and splits into sections
   * renderd as as html grid of videos
   * 
   * @url /videos/:videoName.mp4/group-of-pictures
   * @param videoName name of the video file
   * @returns  view data for videos grid
   */
router.get('/:videoName/group-of-pictures', async (req, res, next) => {
  try {
    const viewData = await new VideoService(req.params.videoName).GetGridViewData();

    res.setHeader('Connection', 'Keep-Alive');
    res.render('videos', {
      viewData
    });
  }
  catch (error: any) {
    next(error);
  }
});


export { router };










