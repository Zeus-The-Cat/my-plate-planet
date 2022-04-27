import { Auth } from "firebase/auth";
import {createContext} from "react";

export const UserContext = createContext<{loggedIn:boolean,auth:Auth}|null>(null)