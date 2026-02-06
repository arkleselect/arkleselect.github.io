import { getMomentsEntries } from "@/lib/content";
import { HeicImage } from "@/components/heic-image";

export default async function MomentsPage() {
    const moments = await getMomentsEntries();

    return (
        <div className="w-full py-0">
            {/* 暂时注释 */}
            {/* <div className="mb-12 flex flex-col items-center gap-4 border-b border-white/5 pb-12 px-4">
                <h1 className="font-press-start text-lg tracking-tighter text-white/90">MOMENTS</h1>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">Archiving the fragments of light</p>
            </div> */}

            {/* Full Width Adaptive Waterfall Grid with 1px gap */}
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-px space-y-px">
                {moments.map((moment, index) => (
                    <div key={`${moment.date}-${index}`} className="group relative overflow-hidden bg-white/5 break-inside-avoid">
                        {moment.image ? (
                            <HeicImage
                                src={moment.image}
                                alt={moment.title || "Moment"}
                                className="w-full h-auto block transition-opacity duration-300"
                            />
                        ) : (
                            <div className="flex aspect-square w-full items-center justify-center text-[10px] text-white/10 uppercase font-mono">
                                No Image
                            </div>
                        )}

                        {/* Hover Overlay - Bottom-up gradient */}
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {moment.title && (
                                <div className="text-[10px] text-white/90 line-clamp-2 px-6 font-mono uppercase tracking-widest text-center leading-relaxed">
                                    {moment.title}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom info */}
            <div className="mt-16 text-center text-[10px] font-mono text-white/10 uppercase tracking-[0.2em]">
                End_of_Stream // Total_Fragments: {moments.length}
            </div>
        </div>
    );
}
