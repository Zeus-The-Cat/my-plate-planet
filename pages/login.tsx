import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextPage } from "next/types";
import { useState } from "react";
import { app } from "../utils/firebase";
import styles from '../styles/Home.module.css'

const auth = getAuth(app)

const Login: NextPage = () => {
    const [email,setEmail] = useState('')
    const [emailValid, setEmailValid] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordValid, setPasswordValid] = useState(false)

    const signIn = () => {
        signInWithEmailAndPassword(auth,email,password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode)
                console.error(errorMessage)
            })
    }

    return(
        <div className={styles.loginCard}>
            <h3>Login</h3>
            <form>
                <label htmlFor="Email-Login">
                    Email<br />
                    <input type="email" name="username-input" 
                        onChange={(e)=>setEmail(e.target.value)} title="testing"
                    />{emailValid?"":" Invalid Email"}
                    <br />
                    Password<br />
                    <input type="password" name="password-input" 
                        onChange={(e)=>setPassword(e.target.value)}
                    />{passwordValid?"":" Invalid Password"}
                    <br />
                </label>
            </form>

            <button name="email-password-submit"
                        onClick={signIn}>Sign In</button>
        </div>
    )
}

export default Login