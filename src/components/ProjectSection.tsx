"use client";

import React, { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem";
import { Loader2, SquarePlus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects } from "@/lib/ProjectFunctions/api";
import mongoose from "mongoose";
import CreateProjectComponent from "./CreateProjectComponent";
export interface projectProps {
  _id:mongoose.Types.ObjectId,
  name: string;
  color: string;
  chats: {
    title: string;
    id:number
  }[];
}




const ProjectSection = () => {
  const [isProjectsExpanded, setisProjectsExpanded] = useState(false);
  const [areChatsVisible, setareChatsVisible] = useState(false);
  const [ProjectsArr, setProjectsArr] = useState([]);
  const [createCompOpen, setCreateCompOpen] = useState(false)
  const [createCompVisible, setCreateCompVisible] = useState(false);
   const queryClient = useQueryClient();

  const { data: projects, error, isLoading } = useQuery({
    queryKey: ["getProjects"],
    queryFn: getProjects,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
 if(projects){
  setProjectsArr(projects)
 }
  }, [projects, ProjectsArr, setCreateCompClose]);

  function setCreateCompClose (){
    setCreateCompOpen(false);
    queryClient.invalidateQueries({ queryKey: ['getProjects'] })
  
  }

  
  

  return (
   <>


    <div>

<span
  className="px-1 font-semibold cursor-pointer "
  onClick={() => setisProjectsExpanded(!isProjectsExpanded)}
  role="button"
  tabIndex={0}
  aria-expanded={isProjectsExpanded}
  >
  Projects
</span>
<span className="pl-5">{isProjectsExpanded ? '▲' : '▼'}</span>
  </div>
<div
className={` transition-all duration-300  ${
  isProjectsExpanded ? "max-h-96" : "max-h-8"
} w-full  rounded-md  m-5  overflow-y-auto  scrollbar-none`}
>


{isProjectsExpanded && (
  <div className="overflow-y-auto  scrollbar-none flex flex-col items-center ">
      <div className="px-3 py-1 rounded font-medium text-white bg-black w-[90%]  cursor-pointer flex justify-center items-center" onClick={()=>setCreateCompOpen(!createCompOpen)}><SquarePlus /></div>
      {isLoading && (
        <Loader2 className="animate-spin "/>
      )}
    {ProjectsArr.map((project, idx) => (
      <ProjectItem key={idx} project={project}/>
    ))}
  
    {!isLoading && ProjectsArr.length === 0 && (
      <p className="text-sm">there are no projects please create one</p>
    )}
  </div>
)}
</div>
  <CreateProjectComponent isOpen={createCompOpen} onClose={setCreateCompClose}/>
   </>
  );
};

export default ProjectSection;
