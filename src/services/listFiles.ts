import { listAll, ref } from "firebase/storage";
import { storage } from "../../firebase";

const listFiles = async (directory: string) => {
  const listRef = ref(storage, directory);
  const res = await listAll(listRef);
  return res.items.map((item) => item.name);
};

export default listFiles;
