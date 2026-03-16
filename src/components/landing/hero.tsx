"use client";

export default function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-40 pb-24"
      style={{
        backgroundColor: "#3b4168", /* solid background using the middle purple-blue shade */
      }}
    >
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl mx-auto -mt-10">
        <h1
          className="text-white font-normal tracking-[-0.03em] mb-4 flex flex-col items-center justify-center gap-1"
          style={{ fontSize: "clamp(40px, 6vw, 76px)", lineHeight: "1.1" }}
        >
          <span>Belajar lebih efektif,</span>
          <span>persiapkan ujianmu</span>
          <div className="flex items-center gap-3 md:gap-4 mt-1 md:mt-2">
            <span>dengan</span>
          </div>
        </h1>

        {/* Handwritten text */}
        <div
           className="text-yellow font-handwriting inline-block -rotate-[3deg] leading-none mb-10"
           style={{ fontSize: "clamp(50px, 8vw, 100px)", marginTop: "-10px" }}
        >
          Kebut Semalam
        </div>

        <div className="mt-12 sm:mt-20 flex flex-col items-center gap-1">
          <p className="text-white text-lg sm:text-[22px] md:text-[26px] font-normal tracking-tight">
            100K+ materi kuliah
          </p>
          <p className="text-white/80 text-xs sm:text-[13px] md:text-[15px] font-normal tracking-wide">
            telah dirangkum oleh AI interaktif kami
          </p>
        </div>
      </div>
    </section>
  );
}