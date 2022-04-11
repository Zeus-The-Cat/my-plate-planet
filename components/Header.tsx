import Image from 'next/image'
import styles from '../styles/Home.module.css'

export const Header = ({auth, setAuth}:{auth:any,setAuth:any}) => {

    const logIn = () => {
        setAuth(true)
    }
    const UserProfile = () => {
        // Uses firebase App to access user's profile image 
        const logOut = () => {
            // Logs user out using Auth0
            setAuth(false)
        }
        return(
            <div className={styles.profileButton}>
                <Image src="/leaf.svg" alt="Profile Picture"
                    width="50" height="50"
                ></Image>
                {auth?<button onClick={logOut}>Log Out</button>:<button onClick={logIn}>Login</button>}
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