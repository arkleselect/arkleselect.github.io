import { getMomentsEntries } from "@/lib/content";
import { MomentsGrid } from "@/components/moments-grid";

export default async function MomentsPage() {
    const moments = await getMomentsEntries();

    return (
        <div className="w-full py-0">
            {/* Dynamic Waterfall Grid controlled by Header */}
            <MomentsGrid moments={moments} />

            {/* Bottom info */}
            <div className="mt-16 text-center text-[10px] font-mono text-white/10 uppercase tracking-[0.2em]">
                End_of_Stream // Total_Fragments: {moments.length}
            </div>
        </div>
    );
}
