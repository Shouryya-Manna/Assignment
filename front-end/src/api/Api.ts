import type { Pupil } from "@/schemas/schema";
import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000/api"
});



export const fetchAllPupilInfo = async()=>{
    const res = await api.get("/pupils");
    return res.status===200?res.data:[];
}

export const createPupilInfo = async (newPupil: Pupil) => {
  const res = await api.post("/pupils", newPupil);
  return res.data as Pupil;
};


