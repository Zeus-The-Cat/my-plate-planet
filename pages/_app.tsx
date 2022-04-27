import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { UserContext } from '../utils/authContext'
import { getAuth } from "firebase/auth";
import { app } from '../utils/firebase';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [auth, setAuth] = useState({
    loggedIn:false,
    auth:getAuth(app)
  })
  useEffect(()=>{
    auth.auth.onAuthStateChanged((user)=>{
      // Trying not to use Observers, only way to update internal state
      //  with Next auth, only way to make it work with react
      if (user){
        // signed in
        if(!auth.loggedIn){
            setAuth({loggedIn:true,auth:auth.auth})
        }
      }else{
        // signed out
        if(auth.loggedIn){
            setAuth({loggedIn:false,auth:auth.auth})
        }
      }
    })
  },[auth,setAuth])

  return (
    <UserContext.Provider value={auth}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
