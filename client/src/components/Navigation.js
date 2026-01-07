import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

function Navigation() {
  let userDetails = useSelector((store)=>{
    return store.userDetails;
  });

  let navigate = useNavigate();

  useEffect(()=>{
    if(userDetails && userDetails.email){

    }else{
      navigate("/");
    };
  });
  return (
    <nav>
        <Link to={"/dashboard"} className="navLink">Dashboard</Link>
        <Link to={"/tasks"} className="navLink">Tasks</Link>
        <Link to={"/leaves"} className="navLink">Leaves</Link>
        <Link to={"/editProfile"} className="navLink">Edit Profile</Link>
        <Link to={"/"} className="navLink">Signout</Link>
    </nav>
  )
}

export default Navigation
