"use client";

import { VIDEOS } from "@/constants/collections";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../firebase";

const KEY = "slm";

export default function Uploader() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file: File = event.target.files[0];
      handleUpload(file);
    }
  };

  const handleUpload = (file: File) => {
    if (!file) {
      return;
    }

    setIsUploading(true);

    const id = uuidv4();
    const path = `${KEY}/${id}`;
    const name = file.name;

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.info("File available at", downloadURL);

          const videoData = {
            id,
            path,
            downloadURL,
            name,
            createdAt: new Date(),
          };
          setDoc(doc(db, VIDEOS, id), videoData)
            .then(() => {
              setIsUploading(false);
            })
            .catch((error) => {
              console.error("Error saving video details:", error);
            });
        });
      },
    );
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Upload Video
      </button>
      {isUploading && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-700">Upload Progress: {progress}%</p>
        </>
      )}
    </div>
  );
}
