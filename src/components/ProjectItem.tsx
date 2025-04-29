"use client";
import React, { useEffect, useState } from "react";
import { projectProps } from "./ProjectSection";
import ChatItem from "./ChatItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FilePlus2 } from "lucide-react";
import FileDialog from "./FileDialog";

interface Props {
  project: projectProps;
}

const ProjectItem = ({ project }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [viewDots, setViewDots] = useState(false);

  const queryClient = useQueryClient();

  const { data: chats } = useQuery({
    queryKey: ["projectChats", project._id],
    queryFn: async () => {
      const res = await axios.get(
        `/api/get-project-chats?ProjectId=${project._id}`
      );
      return res.data.chats;
    },
    refetchOnWindowFocus: true,
  });

  const handleChatExpansion = () => {
    setIsExpanded((prev) => !prev);
    queryClient.invalidateQueries({ queryKey: ["projectChats", project._id] });
  };

  const handleFileDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFileDialog(true);
  };

  const onCloseFileDialog = () => {
    setShowFileDialog(false);
    queryClient.invalidateQueries({ queryKey: ["projectChats", project._id] });
  };

  return (
    <>
      {showFileDialog && (
        <FileDialog projectid={project._id} onClose={onCloseFileDialog} />
      )}
      <div className="p-1 transition-all duration-500 overflow-auto flex flex-col w-[85%] ml-5">
        <div
          className={`px-3 py-1 rounded font-medium text-white cursor-pointer flex justify-between ${project.color}`}
          onClick={handleChatExpansion}
          onMouseEnter={() => setViewDots(true)}
          onMouseLeave={() => setViewDots(false)}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
        >
          <span>{project.name}</span>
          {viewDots && (
            <FilePlus2 size={20} onClick={handleFileDialog} />
          )}
        </div>

        {isExpanded && chats?.length > 0 && (
          <div className="pl-5">
            {chats.map((chat: any) => (
              <ChatItem key={chat._id} chat={chat} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectItem;
