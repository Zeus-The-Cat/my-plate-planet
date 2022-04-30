import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Login from './Login'

import { UserContext } from "../utils/authContext"
import { useContext } from 'react'

export const Header = ({setModal,setModalContent}:{setModal:any,setModalContent:any}) => {
    
    const userContext = useContext(UserContext)

    const logIn = () => {
        setModalContent(<Login setModal={setModal} setModalContent={setModalContent}></Login>)
        setModal(true)
    }
    const UserProfile = () => {
        // Check Auth state to allow user to login
        const logOut = () => {
            // Logs user out using Auth0
            userContext?.auth.signOut().then(() => {
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
                {userContext?.auth.currentUser?<button onClick={logOut}>Log Out</button>:<button onClick={logIn}>Login</button>}
                {userContext?.auth.currentUser?.displayName}
            </div>
        )
    }

    // Header Return
    return (
        <div className={styles.header}>
            <div className={styles.headerLogo}>
                MyPlate
            </div>
            <section>
                <UserProfile></UserProfile>
            </section>
        </div>
    )
}