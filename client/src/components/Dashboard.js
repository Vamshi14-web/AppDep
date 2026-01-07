import React, { use } from 'react'
import Navigation from './Navigation'
import { useSelector } from 'react-redux'

function Dashboard() {
  let userDetails = useSelector((store)=>{
    return store.userDetails
  });
  console.log(userDetails)
  return (
    <div>
      <Navigation></Navigation>
      <h1>Dashboard</h1>
      <h3>{userDetails.firstName} {userDetails.lastName}</h3>
      <h3>Email:{userDetails.email}</h3>
      <h3>Age:{userDetails.age}</h3>
      <h3>MobileNo:{userDetails.mobileNo}</h3>
      <img src={`http://localhost:2233/${userDetails.profilePic}`} alt='' className='profilePic'></img>
    </div>
  )
}

export default Dashboard
