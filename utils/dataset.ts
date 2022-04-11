import { getDocs,collection} from 'firebase/firestore'
import { db } from './firebase'

export const getDataset = async (index:number = 0) => {
    const colRef = collection(db,"dataset")
    const colSnap = await getDocs(colRef);
    if(colSnap && colSnap.docs){
        if(index == 0 && colSnap.docs[0].data().FoodItems){
            return colSnap.docs[0].data().FoodItems
        }else{
            return colSnap.docs[1].data()
        }
    }else{
        console.log("No Such Document")
    }
}

