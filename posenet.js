let video;
let poseNet;
let poses = [];

function setup() {
const canvas = createCanvas (640, 480);
canvas.parent('videoContainer');
// Video capture
video = createCapture(VIDEO);
video.size(width, height);
// Create a new poseNet method with a single detection
poseNet = m15.poseNet(video, modelReady);
//This sets up an event that fills the global variable "poses"
// with an array every time new poses are detected
poseNet.on('pose', function(results) {
poses = results;
});
console.log(poses)
//Hide the video element, and just show the canvas
video.hide();
}
function draw() {
image(video, 0, 0, width, height);
// We can call both functions to draw all keypoints and the skeleton
drawKeypoints();
}
function modelReady(){
select('#status').html('model Loaded')
}
