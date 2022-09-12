import React, { createRef, useEffect, useState } from 'react'
import '../Selfie.css';


const Selfie = () => {

    const [imageUrl, setimageUrl] = useState('')
    const [validationAnswers, setValidationAnswers] = useState({});
    const [questions, setquestions] = useState([])
    const [count,setCount] =useState(0)
const [bottomValue, setbottomValue] = useState(Math.floor(Math.random()*10))
const [rightValue, setRightValue] = useState(Math.floor(Math.random()*10))
const [bottomPosition, setbottomPosition] = useState()
const [rightPosition, setRightPosition] = useState()
    const videoEle = createRef();
    const canvasEle = createRef();
    const imageEle = createRef();


    const startCamera = async () => {
        try {
            const stream =  await navigator.mediaDevices.getUserMedia({
                video: true
            });

           if(stream){
            videoEle.current.srcObject = stream;
           }
            
        } catch(err) {
            console.log(err);
        }
    }

    const stopCamera = () => {
        const stream = videoEle.current.srcObject;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => {
          track.stop();
        });
    }

    const takeSelfie = async () => {
        setbottomPosition(bottomValue)
        setRightPosition(rightValue)
        // Get the exact size of the video element.
        const width = videoEle.current.videoWidth;
        const height = videoEle.current.videoHeight;

        // get the context object of hidden canvas
        const ctx = canvasEle.current.getContext('2d');

        // Set the canvas to the same dimensions as the video.
        canvasEle.current.width = width;
        canvasEle.current.height = height;

        // Draw the current frame from the video on the canvas.
        ctx.drawImage(videoEle.current, 0, 0, width, height);
       
        // Get an image dataURL from the canvas.
        const imageDataURL = canvasEle.current.toDataURL('image/png');

        // Set the dataURL as source of an image element, showing the captured photo.
        stopCamera();
        setimageUrl(imageDataURL)
    }


    const backToCam = () => {
        setimageUrl('')
        setbottomPosition()
        setRightPosition()
    }


    const letsPlay=(e,index)=>{
        e.preventDefault()
        console.log(e.target.classList[1]);
        setValidationAnswers(prev=>({...prev,[index]:'circle'}))

    }

    const generateQuestions=()=>{
        for (let i=0; i<=8;i++){
            generateRandom(i)
        }
    }

    const generateRandom=(i)=>{
        const gen= (Math.floor(Math.random()*10));
        if(gen==0){
            setquestions(prev=>([...prev,'circle']));
           
        } else if(gen==3){
            setquestions(prev=>([...prev,'triangle']));

        } else if(gen==4){
            setquestions(prev=>([...prev,'square']));

        } else {
            setquestions(prev=>([...prev,'']));

        }
    }

    const showRandom=(item,i)=>{
        if(item=='circle'){
            return <div key={i} onClick={(e)=>letsPlay(e)} className='col-sm-4 circle border' style={{height:'80px', width:'80px'}}><i className="fa circle fa-circle fa-lg text-white" aria-hidden="true"></i></div>
           
        } else if(item=='triangle'){
            return <div key={i} onClick={(e)=>letsPlay(e)} className='col-sm-4 triangle border' style={{height:'80px', width:'80px'}}><i className="fa triangle fa-caret-up fa-3x text-white" aria-hidden="true"></i></div>
            
        } else if(item=='square'){
            return <div key={i} onClick={(e)=>letsPlay(e)} className='col-sm-4 square border' style={{height:'80px', width:'80px'}}><i className="fa square fa-square fa-lg text-white" aria-hidden="true"></i></div>
            
        } else {
            return <div key={i} onClick={(e)=>letsPlay(e)} className='col-sm-4 empty border' style={{height:'80px', width:'80px'}}></div>
        }
    }

    useEffect(() => {
      startCamera();
      
    }, [])


    useEffect(()=>{
        setTimeout(() => {
            const gen= (Math.floor(Math.random()*400));
            const gen2= (Math.floor(Math.random()*250));
            setRightValue(gen)
            setbottomValue(gen2)
        }, 500);
    })

    useEffect(() => {
        if(imageUrl==''){
            startCamera()
        } else{
            setquestions([])
            generateQuestions()
        }
      }, [imageUrl])
    


  return (
    <>
    <div className="selfie mt-5">
            {imageUrl === '' && <div className="cam">
                <video width="100%" height="100%" className="video-player" autoPlay={true} ref={videoEle}></video>
                <button className="btn capture-btn" onClick={takeSelfie}>
                    <i className="fa fa-camera" aria-hidden="true"></i>
                </button>

                <div className='row border m-2' style={{height:'240px', width:'240px', position:'absolute', bottom:bottomValue, right:rightValue}}>
      
          
            </div>
            </div>
            }

      


            <canvas ref={canvasEle} style={{display: 'none'}}></canvas>
            {imageUrl !== '' && <div style={{position:'relative'}}>
            <div className="preview">
                <img className="preview-img" src={imageUrl} ref={imageEle} />

                <div className="btn-container">
                    <button className="btn back-btn" onClick={backToCam}>
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <a href={imageUrl} download="selfie.png"
                     className="btn download-btn">
                        <i className="fa fa-download" aria-hidden="true"></i>
                    </a>
                </div>

                <div className='row border m-2' style={{height:'240px', width:'240px', position:'absolute', bottom:bottomPosition, right:rightPosition, backgroundColor:'rgba(255,255,255,0.3)'}}>
       {questions?.map((item,i)=>showRandom(item,i))}
          
            </div>

            </div>

            
            </div>
            }

        </div>

       

        </>
  )
}

export default Selfie