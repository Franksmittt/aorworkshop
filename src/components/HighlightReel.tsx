// [path]: components/HighlightReel.tsx

'use client';
import { Media } from "@/lib/types";
import Image from "next/image";
import Button from "./ui/Button";
import { Share2, Star } from "lucide-react";

interface HighlightReelProps {
    featuredMedia: Media | null;
}

const HighlightReel = ({ featuredMedia }: HighlightReelProps) => {
    if (!featuredMedia) return null;

    return (
        <div className="bg-yellow-900/50 border-2 border-yellow-500/50 p-6 rounded-lg shadow-large my-12">
            <div className="flex items-center mb-4">
                <Star className="h-8 w-8 text-yellow-300 mr-4 flex-shrink-0" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Photo of the Week</h2>
                    <p className="text-yellow-200">A special highlight from the workshop floor.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 relative aspect-video w-full rounded-lg overflow-hidden">
                    <Image src={featuredMedia.url} alt={featuredMedia.caption} fill className="object-cover" />
                </div>
                <div className="flex flex-col items-start">
                    <p className="text-lg font-semibold text-white mb-2">{featuredMedia.caption}</p>
                    <p className="text-sm text-gray-300 mb-4">This is a standout moment from our work on your project this week. We&apos;re excited about the progress!</p>
                    <Button size="sm" variant="secondary" onClick={() => alert('This would open a share dialog.')}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Progress
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HighlightReel;