import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    let emailInputRef = useRef();
    let passwordInputRef = useRef();
    let navigate = useNavigate();
    let dispatch = useDispatch();

    useEffect(()=>{
      if(localStorage.getItem("token")){
        // validateToken();
      }
    },[]);

  let validateToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    let dataToSend = new FormData();
    dataToSend.append("token", token);

    let response = await fetch(
      "http://localhost:2233/validateToken",
      { method: "POST", body: dataToSend }
    );

    let result = await response.json();
    console.log(result);

    if (result.status === "Success") {
      dispatch({ type: "login", data: result.data });
      navigate("/dashboard");
    }
  } catch (err) {
    console.log("Token validation failed");
  }
};


    let login = async()=>{
        let dataToSend = new FormData();
        dataToSend.append("email",emailInputRef.current.value);
        dataToSend.append("password",passwordInputRef.current.value);

     let JSONData = await fetch("http://localhost:2233/login",{method:"POST",body:dataToSend});
     let JSOData = await JSONData.json();
     console.log(JSOData);
     alert(JSOData.msg);
     
     if(JSOData.status === "Success"){
      localStorage.setItem("token",JSOData.data.token);
      
      dispatch({type:"login",data:JSOData.data})
      navigate("/dashboard");
     }
    };
  return (
    <div className='App'>
        <form >
        <h1>Login</h1>
        <div>
            <label>Email</label>
            <input ref={emailInputRef}></input>
        </div>
        <div>
            <label>Password</label>
            <input ref={passwordInputRef}></input>
        </div>
        <div>
            <button type='button' onClick={()=>{
                login();
            }}>Login</button>
        </div>
        <div>
          <h5>Don't have an Account?<Link className='links' to={"/signup"}>Signup</Link></h5>
        </div>
      </form>
      </div>
    
  )
}

export default Login
