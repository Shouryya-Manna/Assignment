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

export const deletePupil = async (_id: string) => {
  if (!_id) throw new Error("Pupil ID is required");
  const res = await api.delete(`/pupils/${_id}`);
  if (res.status !== 200) {
    throw new Error(res.data?.error?.message || "Failed to delete pupil");
  }
  return res.data;
};

export const fetchPupilById = async (id: string): Promise<Pupil> => {
  const response = await api.get(`/pupils/${id}`);
  
  if (response.data.success) {
    return response.data.data as Pupil; // Type assertion
  } else {
    throw new Error(response.data.error?.message || "Failed to fetch pupil");
  }
};