// getVideoURL.js
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";

const getVideoURL = async (fileName: string): Promise<string> => {
  const storageRef = ref(storage, `slm/${fileName}`);
  const url = await getDownloadURL(storageRef);
  return url;
};

export default getVideoURL;
