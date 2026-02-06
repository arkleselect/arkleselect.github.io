export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-center font-mono text-[9px] tracking-[0.15em] text-white/40 uppercase">
          Designed by wa1ybz © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
