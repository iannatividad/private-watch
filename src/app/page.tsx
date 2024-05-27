import Uploader from "@/components/Uploader";
import VideoList from "@/components/VideoList";

export default function Home() {
  return (
    <main className="p-4">
      <Uploader />
      <VideoList />
    </main>
  );
}
