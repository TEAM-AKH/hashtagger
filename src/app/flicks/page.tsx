
'use client';

import { Button } from '@/components/ui/button';
import { Download, Heart, MessageCircle, Send } from 'lucide-react';

const flicks = [
  {
    id: 1,
    title: "The World of Tomorrow",
    thumbnail: "https://picsum.photos/seed/flick1/800/450",
    user: "future_gazers",
    views: "1.2M",
    uploaded: "2 days ago",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: 2,
    title: "Cooking with AI",
    thumbnail: "https://picsum.photos/seed/flick2/800/450",
    user: "chef_bot",
    views: "800K",
    uploaded: "1 week ago",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
  {
    id: 3,
    title: "A Journey Through the Alps",
    thumbnail: "https://picsum.photos/seed/flick3/800/450",
    user: "mountain_explorer",
    views: "3.5M",
    uploaded: "3 weeks ago",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
  },
];

export default function FlicksPage() {
  const handleDownload = (videoSrc: string, title: string) => {
    const link = document.createElement('a');
    link.href = videoSrc;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Flicks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flicks.map((flick) => (
          <div key={flick.id} className="bg-card rounded-lg overflow-hidden border shadow-sm">
            <video controls poster={flick.thumbnail} className="w-full h-auto aspect-video">
                <source src={flick.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h3 className="font-bold text-lg">{flick.title}</h3>
              <p className="text-sm text-muted-foreground">@{flick.user}</p>
              <p className="text-sm text-muted-foreground">{flick.views} views • {flick.uploaded}</p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Heart className="h-5 w-5" /> Hubb
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" /> Express
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Send className="h-5 w-5" /> Circulate
                    </Button>
                </div>
                 <Button variant="outline" size="sm" onClick={() => handleDownload(flick.videoSrc, flick.title)}>
                    <Download className="h-5 w-5 mr-2" /> Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
