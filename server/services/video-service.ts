import { exec } from "child_process";
import path from 'path';
import { Response } from 'express';
import { createReadStream, ReadStream } from 'fs';
import Ffmpeg from "fluent-ffmpeg";

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

        let process = await new Promise<string>((resolve, reject) => {
            exec(command, { maxBuffer: 5 * 1024 * 1024 }, (error: any, stdout: string, stderr: any) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return reject(new Error(`error: ${error.message}`))
                }

                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }

                return resolve(stdout);
            })
        }).then(result => result);

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
    public async GetGridViewData() {
        var iframes = await this.iFrameJson;

        let results = iframes.map(async (_: any, i: any) => {
            var range = await this.GetFrameRange(i)
            const { start, end } = range;
            const url = `http://localhost:3080/videos/${this.videoName}/group-of-pictures/${i}.mp4`;
            return { start, end: end, url };
        });

        let promises = Promise.all(results)

        let data = await promises.then(result => result);

        return data
    }

    /**
     * get the requsted Group based on the frame index
     * @param index 
     * @param writeStream 
     */
    public async GetFrameViewDataByIndex(index: number, writeStream: Response) {
        const range = await this.GetFrameRange(index);

        const { start, end } = range;

        // create a readable stream to pass to the command
        const readStream = await createReadStream(this.pathName);

        // keep the connection alive for longer response times
        writeStream.setHeader("Connection", "Keep-Alive");

        // set the correct mime type
        writeStream.contentType("mp4");

        Ffmpeg(readStream)
            .setStartTime(start)
            .setDuration(end)
            .addOutputOptions(
                "-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov"
            )
            .format("mp4")
            .on("end", (data) => {
                console.log("file written successfully");
            })
            .on("stderr", (e) => {
                console.log("STDERR SINGLE CLIP", e);
            })
            .on("error", (e) => {
                console.log("ERROR GETTING SINGLE CLIP", e);
            })
            // pipe the output data directly on the write stream and send the response
            .pipe(writeStream, { end: true });
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

            if (frameIndex === iframes.length - 1) {
                isLastFrame = true;
            }

            const start = iframes[frameIndex].best_effort_timestamp_time;

            const end = isLastFrame ? await this.GetDurationForLastFrame() : await iframes[frameIndex + 1].best_effort_timestamp_time;

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
    private async GetDurationForLastFrame() {
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

        const frames = JSON.parse(process)['frames'];

        const lastFrame = frames[frames.length - 1]

        const duration = lastFrame.best_effort_timestamp_time

        return duration;
    }
};





