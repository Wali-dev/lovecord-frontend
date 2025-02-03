import { Button } from "@/components/ui/button";
import Link from "next/link";

const History = () => {
    return (
        <div className="mt-10 mb-16 h-screen mx-2">

            <div className="p-3 text-white bg-black text-center sm:max-w-3xl mx-auto flex items-center justify-center gap-2 rounded-md mb-6">
                <span className="text-sm sm:text-base">Your history will be removed after your cookies are deleted 😁</span>
            </div>
            <div className="w-full sm:max-w-3xl mx-auto bg-slate-100 border-2 border-black rounded-md p-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <Link href="#" className="underline break-all text-sm sm:text-base">
                        https://sendthesong.xyz/details/679f82071fc54584f6556b79
                    </Link>
                    <Button className="h-8 px-4 text-xs sm:text-sm">Copy Link</Button>
                </div>
            </div>
        </div>
    );
};

export default History;  