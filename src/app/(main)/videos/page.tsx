import TrendsSidebar from "@/components/TrendsSidebar";
import VideosFeed from "./VideosFeed";

export const metadata = {
  title: "Videos",
};

export default function VideosPage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <h1 className="text-2xl font-bold px-4">Videos</h1>
        <VideosFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}