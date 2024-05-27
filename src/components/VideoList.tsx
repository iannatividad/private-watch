"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { VIDEOS } from "@/constants/collections";
import { useRouter } from "next/navigation";

type Video = {
  id: string;
  name: string;
  path: string;
  downloadURL: string;
};

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, VIDEOS), (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Video[];
      setVideos(videosData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-2">
      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => router.push(`/player/${video.id}`)}
          className="cursor-pointer py-2 px-4 hover:bg-gray-200 rounded-md hover:text-gray-700"
        >
          {video.name}
        </div>
      ))}
    </div>
  );
}
