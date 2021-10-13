import { exec } from "child_process";
import path from 'path';

export class VideoService {
    private videoName: string;

    private pathName: string;

    private iFrameJson;

    /**
     * construcor
    * @param videoName name of the video
    */
    constructor(videoName: string) {
        this.videoName = videoName;
        this.pathName = path.join(__dirname, "../", `data/${videoName}`);
        this.iFrameJson = this.GetIFrameInJson();
    }

    /**
     * Get IFrame data in a json format
     * @param command command line argument: ffprobe -i [file path] -show_frames -print_format [format]
     * @returns a promise string 
     */
    public async GetIFrameInJson() {
        //var path = `ffprobe -i D:/development/React/sites/Group-of-Pictures/server/data/CoolVideo.mp4 -show_frames -print_format json`

        // define the command: show the video frames and out put as a json string
        const command = `ffprobe -i ${this.pathName} -show_frames -print_format json`;

        const process: string = await new Promise((resolve, reject) => {
            exec(command, { maxBuffer: 5 * 1024 * 1024 }, (error: any, stdout: string, stderr: any) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return reject(`error: ${error.message}`)
                }

                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }

                return resolve(stdout);
            });
        });

        // parse the output buffer and select the frames property
        const json = JSON.parse(process)['frames'];

        // only return the data for the iFrames  
        return json.filter((i: any) => i.pict_type === "I");
    }

    /**
     * Get Video grid data to st the views for the videos
     * use the iframes  to set view data and build out urls for the grid clips
     * @returns array of randes with urls
     */
    public async GetGridData() {
        var iframes = await this.iFrameJson;

        return await iframes.map(async (_: any, i: any) => {
            var range = await this.GetFrameRange(i)
            const { start, end } = range;
            const url = `http://localhost:3080/api/videos/${this.videoName}.mp4/group-of-pictures/${i}.mp4`;
            return { start, end: +start + end, url };
        });
    }

    /**
     * get the range from start pictype I to the next I frane
    * @param frameIndex
    * @returns
    */
    private async GetFrameRange(frameIndex: number) {
        var isLastFrame = false;

        var iframes = await this.iFrameJson;

        try {
            if (frameIndex > iframes.length - 1) {
                throw new Error(`The frame you requested is out of range, your selection must be between 0 and  ${iframes.length - 1}`);
            }

            //if (frameIndex === iframes.length - 1) {
            //    isLastFrame = true;
            //}

            const start = iframes[frameIndex].best_effort_timestamp_time;

            const end = 5; //lets jus set a value for now

            return { start, end };
        } catch (error) {
            throw error;
        }

    }

    /**
     * Get the duration from I-I, if looking at the last clip, there is no following clip
     * so we need to go from tat to the last frame(P,B)
     * @returns 
     */
    private async GetDuration() {
        const command = `"ffprobe" -of json -show_streams -show_format ${this.pathName}.mp4`;
        const process: string = await new Promise((resolve, reject) => {
            exec(command, { maxBuffer: 5 * 1024 * 1024 }, (error: any, stdout: string, stderr: any) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return reject(`error: ${error.message}`)
                }

                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }

                return resolve(stdout);
            });
        });

        const duration = JSON.parse(process).streams[0].duration;

        return duration;
    }
};





