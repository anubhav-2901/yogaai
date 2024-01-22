let video;
let poseNet;
let poses = [];
let c = document.getElementById('camera');
let neuralNetwork;

function setup() {
  let ccanvas = createCanvas(500, 400);
  ccanvas.parent(c);
  video = createCapture(VIDEO);
  video.size(width, height);

  neuralNetwork = ml5.neuralNetwork({ task: 'classification' })

  const modelInfo = {
    model: 'model.json',
    metadata: 'model_meta.json',
    weights: 'model.weights.bin',
  }

  neuralNetwork.load(modelInfo, yogaModelLoaded)
  
  // Hide the video element, and just show the canvas
  video.hide();
}

function yogaModelLoaded() {
  poseNet = ml5.poseNet(video, "single", poseModelReady)
  poseNet.on("pose", gotPoses)
  draw()
}

function poseModelReady() {
  poseNet.singlePose(video)
}

function gotPoses(results) {
  poses = results
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  drawSkeleton();
  classifyKeyPoints()
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function classifyKeyPoints(){
  if(poses.length > 0) {
      let points = []
      for (let keypoint of poses[0].pose.keypoints) {
          points.push(Math.round(keypoint.position.x))
          points.push(Math.round(keypoint.position.y))
      }

      neuralNetwork.classify(points, yogaResult)
  }
}

function yogaResult(error, result) {
  if (error) console.error(error)
  console.log(result[0].label + " confidence:" + result[0].confidence.toFixed(2))
}
