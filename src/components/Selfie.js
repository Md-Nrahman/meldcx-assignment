import React, { createRef, useEffect, useState } from "react";
import swal from "sweetalert";
import ErrorScreen from "../screens/ErrorScreen";
import "../Selfie.css";

const Selfie = () => {
  const [imageUrl, setimageUrl] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const [errorDate, setErrorDate] = useState();
  const [validationAnswers, setValidationAnswers] = useState({});
  const [cameraPermission, setCameraPermission] = useState(true);
  const [questions, setquestions] = useState([]);
  const [validateObject, setValidateObject] = useState();
  const [errorCount, setErrorCount] = useState(
    JSON.parse(localStorage.getItem("failed"))
      ? JSON.parse(localStorage.getItem("failed"))
      : 0
  );
  const [bottomValue, setbottomValue] = useState(
    Math.floor(Math.random() * 10)
  );
  const [rightValue, setRightValue] = useState(Math.floor(Math.random() * 10));
  const [bottomPosition, setbottomPosition] = useState();
  const [rightPosition, setRightPosition] = useState();
  const videoEle = createRef();
  const canvasEle = createRef();
  const imageEle = createRef();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (stream) {
        videoEle.current.srcObject = stream;
      }
    } catch (err) {

        navigator.permissions.query({ name: "camera" }).then(res => {
            if(res.state == "granted"){
                errorCount <= 5 && window.location.reload();
            } else{
                setCameraPermission(false)
            }
        });
    
    }
  };

  const stopCamera = () => {
    const stream = videoEle.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });
  };

  const takeSelfie = async () => {
    setbottomPosition(bottomValue);
    setRightPosition(rightValue);
    // Get the exact size of the video element.
    const width = videoEle.current.videoWidth;
    const height = videoEle.current.videoHeight;

    // get the context object of hidden canvas
    const ctx = canvasEle.current.getContext("2d");

    // Set the canvas to the same dimensions as the video.
    canvasEle.current.width = width;
    canvasEle.current.height = height;

    // Draw the current frame from the video on the canvas.
    ctx.drawImage(videoEle.current, 0, 0, width, height);

    // Get an image dataURL from the canvas.
    const imageDataURL = canvasEle.current.toDataURL("image/png");

    // Set the dataURL as source of an image element, showing the captured photo.
    stopCamera();
    setimageUrl(imageDataURL);
  };

  const backToCam = () => {
    setimageUrl("");
    setbottomPosition();
    setRightPosition();
  };

  const letsPlay = (e, index, value) => {
    e.preventDefault();
    if (validationAnswers?.[index]) {
      let diff = validationAnswers;
      delete diff[index];
      setValidationAnswers(diff);
    } else {
      setValidationAnswers((prev) => ({ ...prev, [index]: value }));
    }
  };

  const generateQuestions = () => {
    for (let i = 0; i <= 8; i++) {
      generateRandom(i);
    }
  };

  let Objectcount = 0;

  questions.forEach((element) => {
    if (element == validateObject) {
      Objectcount += 1;
    }
  });

  let totalObj = Object.values(validationAnswers);
  let validationCount = 0;

  totalObj.forEach((element) => {
    if (element == validateObject) {
      validationCount += 1;
    }
  });

  const generateRandom = (i) => {
    const gen = Math.floor(Math.random() * 10);
    if (gen <= 2) {
      setquestions((prev) => [...prev, "circle"]);
      setValidateObject("circle");
    } else if (gen >= 3 && gen <= 5) {
      setquestions((prev) => [...prev, "triangle"]);
      setValidateObject("triangle");
    } else if (gen >= 6 && gen < 7) {
      setquestions((prev) => [...prev, "square"]);
      setValidateObject("square");
    } else {
      setquestions((prev) => [...prev, "empty"]);
      setValidateObject("empty");
    }
  };

  const showRandom = (item, i) => {
    if (item == "circle") {
      return (
        <div
          key={i}
          onClick={(e) => letsPlay(e, i, "circle")}
          className={`col-sm-4 circle border ${
            validationAnswers[i] == "circle" && "bg-info"
          }`}
          style={{ height: "80px", width: "80px" }}
        >
          <i
            className="fa circle fa-circle fa-lg text-white"
            aria-hidden="true"
          ></i>
        </div>
      );
    } else if (item == "triangle") {
      return (
        <div
          key={i}
          onClick={(e) => letsPlay(e, i, "triangle")}
          className={`col-sm-4 triangle border ${
            validationAnswers[i] == "triangle" && "bg-info"
          }`}
          style={{ height: "80px", width: "80px" }}
        >
          <i
            className="fa triangle fa-caret-up fa-3x text-white"
            aria-hidden="true"
          ></i>
        </div>
      );
    } else if (item == "square") {
      return (
        <div
          key={i}
          onClick={(e) => letsPlay(e, i, "square")}
          className={`col-sm-4 square border ${
            validationAnswers[i] == "square" && "bg-info"
          }`}
          style={{ height: "80px", width: "80px" }}
        >
          <i
            className="fa square fa-square fa-lg text-white"
            aria-hidden="true"
          ></i>
        </div>
      );
    } else {
      return (
        <div
          key={i}
          onClick={(e) => letsPlay(e, i, "empty")}
          className={`col-sm-4 empty border ${
            validationAnswers[i] == "empty" && "bg-info"
          }`}
          style={{ height: "80px", width: "80px" }}
        ></div>
      );
    }
  };

  const validationPipeline = () => {
    if (validationCount != Objectcount) {
      setErrorCount(errorCount + 1);
      setErrorDate(Date.now() + (errorCount ? 5000 * errorCount : 5000));
      localStorage.setItem("failed", errorCount + 1);
    } else {
      swal("success", "Validation Successful", "success").then(() =>
        backToCam()
      );
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const gen = Math.floor(Math.random() * 400);
      const gen2 = Math.floor(Math.random() * 250);
      setRightValue(gen);
      setbottomValue(gen2);
      setCurrentDate(Date.now());
    }, 1000);
  });

  useEffect(() => {
    if (imageUrl == "") {
      startCamera();
    } else {
      setquestions([]);
      generateQuestions();
    }
  }, [imageUrl]);
  
  if (cameraPermission==false) {
    return <ErrorScreen message="Please Allow Camera Permission to use the App & Refresh the page"/>;
  }
  if (errorCount <= 5 && errorDate > currentDate) {
    return <ErrorScreen count={errorCount} time={errorDate - currentDate} />;
  }

  if (errorCount > 5) {
    return <ErrorScreen count={errorCount} />;
  }

  return (
    <div style={{background:'#03285D', height:'100vh', width:'100vw'}} className="d-flex justify-content-center align-items-center">
        <div style={{background:'#ffffff', height:'85vh', width:'85vw'}} className="p-5 d-flex flex-column justify-content-center align-items-center">
            <h5>{!imageUrl ? 'Take Selfie' : `Select ${validateObject}s`}</h5>
            {imageUrl === "" && (
          <div className="cam">
            <video
              width="100%"
              height="100%"
              className="video-player"
              autoPlay={true}
              ref={videoEle}
            ></video>
           

            <div
              className="row border m-2"
              style={{
                height: "240px",
                width: "240px",
                position: "absolute",
                bottom: bottomValue,
                right: rightValue,
              }}
            ></div>
          </div>
        )}

<canvas ref={canvasEle} style={{ display: "none" }}></canvas>


{imageUrl !== "" && (
          <div style={{ position: "relative" }}>
            <div className="preview">
              <img className="preview-img" src={imageUrl} ref={imageEle} />

              <div className="btn-container">
                <button className="btn back-btn" onClick={backToCam}>
                  <i className="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
                <a
                  href={imageUrl}
                  download="selfie.png"
                  className="btn download-btn"
                >
                  <i className="fa fa-download" aria-hidden="true"></i>
                </a>
              </div>

              <div
                className="row border m-2"
                style={{
                  height: "240px",
                  width: "240px",
                  position: "absolute",
                  bottom: bottomPosition,
                  right: rightPosition,
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
              >
                {questions?.map((item, i) => showRandom(item, i))}
              </div>
            </div>
          </div>
        )}

        

<button className="btn btn-warning text-white mt-2" onClick={!imageUrl ? takeSelfie : validationPipeline}>
              {`${!imageUrl? 'Capture' : 'Validate'}`}
            </button>

        {imageUrl && <h5 className="text-danger m-1">N.B: If you fail to validate more than 5 times, you will be blocked</h5>}

        </div>

      
    </div>
  );
};

export default Selfie;
