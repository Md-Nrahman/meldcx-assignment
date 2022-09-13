import React from 'react'
import 'animate.css';

const ErrorScreen = ({count,time, message}) => {
    
  return (
<>
{count>5 &&(
<div style={{width:'100vw', height:'100vh'}} className="bg-danger d-flex align-items-center">
    <div style={{verticalAlign: 'middle', fontFamily:'Roboto', fontSize:'72px'}} className=" text-center text-white animate__animated animate__bounceInLeft">For failing to validate error multiple times you have been blocked</div>

</div>
)}
{message &&(
<div style={{width:'100vw', height:'100vh'}} className="bg-danger d-flex align-items-center justify-content-center">
    <div style={{verticalAlign: 'middle', fontFamily:'Roboto', fontSize:'60px'}} className=" text-center text-white animate__animated animate__bounceInLeft">{message}</div>

</div>
)}
{count<=5 &&(
    <div style={{width:'100vw', height:'100vh'}} className="bg-danger d-flex flex-column justify-content-center align-items-center">
    <div style={{verticalAlign: 'middle', fontFamily:'Roboto', fontSize:'32px'}} className=" text-center text-white animate__animated animate__bounceInLeft">You are blocked for</div>
    <div style={{verticalAlign: 'middle', fontFamily:'Roboto', fontSize:'72px'}} className=" text-center text-white animate__animated animate__bounceInLeft">{Math.round((time)/1000)}</div>
    <div style={{verticalAlign: 'middle', fontFamily:'Roboto', fontSize:'32px'}} className=" text-center text-white animate__animated animate__bounceInLeft">seconds</div>

    </div>
)}
    
    </>
  )
}

export default ErrorScreen