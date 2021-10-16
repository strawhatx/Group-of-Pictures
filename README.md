# Group of Pictures

The object of this project is to build a small HTTP server that delivers:

1.  a Json representation of the supplied Video,

2.  a grid of segmented videos based on the original copy

3.  Single Video based on the indexed video

## Dependencies

    - FFMPEG (Download link: https://ffmpeg.org/download.html)
    - NodeJs/Npm (Download link: https://nodejs.org/en/)

## Insallation

1.  clone this respository: `https://github.com/strawhatx/Group-of-Pictures.git`

2.  Install packages: `npm install`

3.  To start the server: `npm run server`

## JSON Endpoint

    -   This endpoint should respond with JSON encoded data showing details of all the I frames in a video

[http://localhost:3080/videos/CoolVideo.mp4/group-of-pictures.json](http://localhost:3080/videos/CoolVideo.mp4/group-of-pictures.json)

## Segmented Vides

    -   This endpoint should respond with a HTML document containing grid of all the groups of pictures in playable <video> elements and their timestamps.

[http://localhost:3080/videos/CoolVideo.mp4/group-of-pictures](http://localhost:3080/videos/CoolVideo.mp4/group-of-pictures)

## Video by Frame Index

    -   This endpoint should respond with an mp4 file containing ONLY the video data for the group of pictures requested
        - ex. (`http://localhost:3080/videos/CoolVideo.mp4/group-of-pictures/<index>.mp4`)
