import { createProjectProp } from "@/app/api/(app)/(project)/create-project/route";
import axios from "axios";

export async function getProjects() {
  try {
    const res = await axios.get(`/api/get-projects`);
    console.log(res.data.projects);
    return res.data.projects;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
export async function getProjectChats() {
  try {
    const res = await axios.get(`'/api/get-project-chats`);
    console.log(res.data.chats);
    return res.data.chats;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
export async function createProject(data: createProjectProp) {
  try {
    const res = await axios.post(`/api/create-project`, data);
    console.log(res.data.chats);
    return res.data.chats;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
export async function addChatsToProject(data:any) {
  try {
    const res = await axios.post(`/api/add-chatTo-project`, data);
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
export async function deleteProject(projectid: any) {
  try {
    const res = await axios.post(`/api/delete-project`, {
      projectid,
    });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
