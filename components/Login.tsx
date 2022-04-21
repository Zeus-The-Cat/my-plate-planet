import { getAuth, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { app } from "../utils/firebase";
import styles from '../styles/Home.module.css'
import SignUp from "./SignUp";

const auth = getAuth(app)

const Login = (props:any) => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const signIn = () => {
        signInWithEmailAndPassword(auth,email,password)
            .then((_userCredential) => {
                props.setModal(false)
            })
            .catch((_error)=>{
                setErrorMessage('Incorrect email or password')
            })
    }
    const createAccount = () => {
        // changes modals jsx object to SignUp
        props.setModalContent(<SignUp setModal={props.setModal}></SignUp>)
    }
    return(
        <div className={styles.modalContainer}>
            <h3>Login</h3>
            <form>
                <label htmlFor="Email-Login">
                    Email<br />
                    <input type="email" name="username-input" 
                        onChange={(e)=>setEmail(e.target.value)} title="testing"
                    />
                    <br />
                    Password<br />
                    <input type="password" name="password-input" 
                        onChange={(e)=>{setPassword(e.target.value);setErrorMessage('')}}
                    />
                    <div className={styles.message}>
                        {errorMessage&&errorMessage}
                    </div>
                    <br />
                </label>
            </form>
            <button name="email-password-submit"
                        onClick={signIn}>Sign In</button>
            <span className={styles.createAccount} onClick={createAccount}>Create Account</span>            
        </div>
    )
}

export default Login