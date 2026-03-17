import { FolderOpen } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="bg-dark/80 backdrop-blur-md border-b-2 border-white/20 px-8 py-6 sticky top-0 z-0 ks-grid-bg">
      <div className="flex items-center gap-4 bg-dark-90 p-2 rounded-2xl border-2 border-white/30 w-fit shadow-[4px_4px_0px_#ffffff]">
        <div className="w-12 h-12 rounded-xl bg-purple border-2 border-white/30 flex items-center justify-center">
          <FolderOpen className="text-white w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="pr-4">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h1>
          <p className="text-sm font-bold text-gray">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
