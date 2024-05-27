"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { VIDEOS } from "@/constants/collections";

export default function PlayerPage() {
  const router = useRouter();
  const { id } = useParams();

  const [videoDetails, setVideoDetails] = useState<null | {
    name: string;
    downloadURL: string;
  }>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (id && typeof id === "string") {
        const docRef = doc(db, VIDEOS, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVideoDetails(
            docSnap.data() as { name: string; downloadURL: string },
          );
        } else {
          console.info("No such document!");
        }
      }
    };

    fetchVideoDetails();
  }, [id]);

  if (!id || typeof id !== "string" || !videoDetails) {
    return (
      <div className="flex flex-col items-center gap-4 justify-center h-screen">
        <span className="text-base text-white">Video is loading</span>
        <button
          className="text-sm text-white border rounded-md px-2 py-1"
          onClick={() => router.back()}
        >
          {"<"} back
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="p-4">
        <button className="text-sm text-white" onClick={() => router.back()}>
          {"<"} back
        </button>
      </div>
      <div className="p-4">
        <span className="text-sm text-white">{videoDetails.name}</span>
      </div>
      <VideoPlayer id={id} />
    </div>
  );
}
