import { useEffect, useState } from "react"
import { getAuth, createUserWithEmailAndPassword, Auth, UserCredential, User } from 'firebase/auth'
import { app } from "../utils/firebase"
import { NextPage } from "next/types"
import styles from '../styles/Home.module.css'

const Testing: NextPage = () => {
    const [email,setEmail] = useState('')
    const [emailValid, setEmailValid] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordValid, setPasswordValid] = useState(false)

    const auth = getAuth(app);

    const createUser = (auth_:Auth,email:string,password:string)=>{
        createUserWithEmailAndPassword(auth_, email, password)
        .then((userCredential:UserCredential) => {
          // Signed in 
          const user:User = userCredential.user;
        })
        .catch((error) => {
        //   const errorCode = error.code;
        //   const errorMessage = error.message;
          console.error("Error creating account at createUser")
        });
    }
    const submitUser = () => {
        email && password ? createUser(auth,email,password) : null
    }

    const validateEmail = (e:any) => {
        const email_ = e.target.value ? e.target.value : ""
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
        if(regex.test(email_)){
            setEmailValid(true)
            setEmail(email_)
        }else{
            setEmailValid(false)
        }
    }

    const validatePassword = (e:any)=>{
        const pwd = e.target.value ? e.target.value : ""
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/g;
        if(regex.test(pwd)){
            setPasswordValid(true);
            setPassword(pwd)
        }else{ 
            setPasswordValid(false)
        }
    }
    
    return(
        <div className={styles.addUserByEmail}>
            <h3>Create Account</h3>
            <form>
                <label htmlFor="Email-Login">
                    Email<br />
                    <input type="email" name="username-input" 
                        onChange={validateEmail} title="testing"
                    />{emailValid?"Passed":" Invalid Email"}
                    <br />
                    Password<br />
                    <input type="password" name="password-input" 
                        onChange={validatePassword}
                    />{passwordValid?"Passed":" Invalid Password"}
                    <br />
                </label>
            </form>

            <button name="email-password-submit"
                        onClick={submitUser}>Create Account</button>
        </div>
    )
}

export default Testing