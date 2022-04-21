import { useEffect, useState } from "react"
import { getAuth, createUserWithEmailAndPassword, Auth, UserCredential, User } from 'firebase/auth'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { app, db } from "../utils/firebase"

import styles from '../styles/Home.module.css'

const SignUp = (props:any) => {
    const [email,setEmail] = useState('')
    const [emailValid, setEmailValid] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordValid, setPasswordValid] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [passwordMatchError, setPasswordMatchError] = useState('')
    const auth = getAuth(app);

    const createUser = (auth_:Auth,email_:string,password_:string)=>{
        createUserWithEmailAndPassword(auth_, email_, password_)
        .then((userCredential:UserCredential) => {
            // Need to set auth context to new user's
            const user:User = userCredential.user;
            const addDocument = async () =>{
                await setDoc(doc(db,'users',user?.uid),{
                    meals:[],
                    createdOn: Timestamp.fromDate(new Date()),
                    email:user?.email
                  })
                .then((_res)=>{
                    props.setModal(false);
                })
            }
            addDocument();
        })
        .catch((_error) => {
            setPasswordValid(false);
            setPassword('');
            setPasswordError('Error creating account')
        });
    }
    const submitUser = () => {
        emailValid && passwordValid && passwordMatch ? createUser(auth,email,password) : null
    }

    const validateEmail = (e:any) => {
        const email_ = e.target.value ? e.target.value : ""
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
        if(regex.test(email_)){
            setEmailError('')
            setEmailValid(true)
            setEmail(email_)
        }else{
            setEmailValid(false)
            setEmailError('Invalid Email')
        }
    }

    const validatePasswordsMatch = (e:any) => {
        if(password == e.target.value){
            setPasswordMatch(true)
            setPasswordMatchError('')
        }else{
            setPasswordMatchError('Passwords do not match')
            setPasswordMatch(false)
        }
    }

    const validatePassword = (e:any)=>{
        const pwd = e.target.value ? e.target.value : ""
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/g;
        if(regex.test(pwd)){
            setPasswordError('')
            setPasswordValid(true);
            setPassword(pwd)
        }else{ 
            setPasswordValid(false)
            setPasswordError('Invalid Password')
        }
    }

    return(
        <div className={styles.modalContainer}>
            <h3>Create Account</h3>
            <form>
                <label htmlFor="Email-Login">
                    Email<br />
                    <input type="email" name="username-input" 
                        onChange={validateEmail} title="testing"
                    />
                    <div className={styles.message}>
                        {emailError}
                    </div>
                    Password<br />
                    <input type="password" name="password-input" 
                        onChange={validatePassword}
                    />
                    <div className={styles.message}>
                        {passwordError}
                    </div>
                    Re-Enter Password<br />
                    <input type="password" name="password-input" 
                        onChange={validatePasswordsMatch}
                    />
                    <div className={styles.message}>
                        {passwordMatchError}
                    </div>
                    <br />
                </label>
            </form>

            <button name="email-password-submit" 
                        onClick={submitUser}>Create Account</button>
        </div>
    )
}

export default SignUp