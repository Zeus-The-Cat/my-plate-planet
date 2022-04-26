import { Auth, getAuth, signOut } from 'firebase/auth'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Login from './Login'
import { UserContext } from "../utils/authContext"
import { useContext } from 'react'

export const Header = ({setModal,setModalContent}:{setModal:any,setModalContent:any}) => {
    const userContext:Auth|null = useContext(UserContext)

    const logIn = () => {
        setModalContent(<Login setModal={setModal} setModalContent={setModalContent}></Login>)
        setModal(true)
    }
    const UserProfile = () => {
        // Check Auth state to allow user to login
        const logOut = () => {
            // Logs user out using Auth0
            userContext?.signOut().then(() => {
                // Sign-out successful.
            }).catch((_error) => {
                // An error happened.
            });
        }
        return(
            <div className={styles.profileButton}>
                <Image src="/leaf.svg" alt="Profile Picture"
                    width="50" height="50"
                ></Image>
                {userContext?.currentUser?<button onClick={logOut}>Log Out</button>:<button onClick={logIn}>Login</button>}
                {userContext?.currentUser?.displayName}
            </div>
        )
    }

    // Header Return
    return (
        <div className={styles.header}>
            <div className={styles.headerLogo}>
                myPL
                <span>
                    <span>ate</span>
                    <span>anate</span>
                </span>
            </div>
            <section>
                <UserProfile></UserProfile>
            </section>
        </div>
    )
}