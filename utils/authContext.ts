import { Auth } from "firebase/auth";
import {createContext} from "react";

export const UserContext = createContext<Auth|null>(null)