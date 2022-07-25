import {
    db
} from '../firebase.js'

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";

async function getTimeslots(name) {
    const timeslotsRef = doc(db, "timeslots", name);
    const docSnap = await getDoc(timeslotsRef);

    if (!docSnap.exists()) {
        console.log("No such document!");
        return
    }
    
    return docSnap.data();
}


async function updateTimeslots(name, start, increase) {
    const data = doc(db, "timeslots", name);
    getDoc(data).then(
        async function update(doc) {
            const detail = doc.data();
            for (const item in detail) {
                console.log(detail[item]["start"]);
                if (detail[item]["start"] === start["startTime"]) {
                    if (increase === true) {
                        detail[item]["capacity"] = detail[item]["capacity"] +1;
                        console.log(detail[item]);
                        setDoc(data, detail);   
                    } else {
                        detail[item]["capacity"] = detail[item]["capacity"] -1;
                        console.log(detail[item]);
                        setDoc(data, detail);    
                    }
                }
            }
        }
        
    )
}

async function quickPop(name) {
    const data = doc(db, "timeslots", "krmpsh");
    const data2 = doc(db, "timeslots", name);
    getDoc(data).then((doc) => updateDoc(data2, doc.data()));
}

async function updateCapacity(name, key, day, bool) {
    const dayz = key["day"];
    console.log(key)
    const data = doc(db, "capacity", name);
    getDoc(data).then(
        async function update(doc) {
            const detail = doc.data();
            var capacity = undefined;
            for (const item in detail){
                console.log(item)
                if (item === dayz) {
                    capacity = detail[item]["capacity"];
                }
            }
            console.log(capacity);
            console.log(dayz)
            if (capacity === undefined) {
                day["capacity"] = 9;
                updateDoc(data, {[dayz]:day});
            } else if(bool === true) {
                day["capacity"] = capacity-1;
                updateDoc(data, {[dayz]:day});
            } else {
                day["capacity"] = capacity+1;
                updateDoc(data, {[dayz]:day});
            }
        }
    )
}

async function checkCapacity(name) {
    const capacityRef = doc(db, "capacity", name);
    const docSnap = await getDoc(capacityRef);

    if (!docSnap.exists()) {
        console.log("No such document!");
        return
    }
    
    return docSnap.data();

}


export {
    getTimeslots,
    updateTimeslots,
    quickPop,
    updateCapacity,
    checkCapacity
}