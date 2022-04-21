import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { UserContext } from '../utils/authContext'
import { getAuth } from "firebase/auth";
import { app } from '../utils/firebase';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContext.Provider value={getAuth(app)}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
