export default function HeroMockup() {
  return (
    <div className="relative order-1 mx-auto flex w-full max-w-[760px] items-center justify-center lg:order-2">
      {/* Resplandor morado original */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[55px]"
      />

      {/* Mockup */}
      <div className="mockup-float relative mx-auto w-[90%]">
        {/* ============================== */}
        {/* LAPTOP */}
        {/* ============================== */}

        <div className="relative mx-auto w-[96%] max-w-[690px] -rotate-[1.5deg]">
          {/* Tapa / marco */}
          <div className="relative overflow-hidden rounded-[18px] border border-white/20 bg-gradient-to-br from-[#29243b] via-[#13101e] to-[#050508] p-[5px] shadow-[0_30px_70px_rgba(0,0,0,0.58),0_0_28px_rgba(124,58,237,0.08)] sm:rounded-[24px] sm:p-[7px]">
            {/* Cámara */}
            <div className="absolute left-1/2 top-[3px] z-30 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/20 sm:top-[4px]" />

            {/* Pantalla laptop */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[13px] bg-[#080510] sm:rounded-[18px]">
              <DesktopScreen />

              {/* Reflejo original */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_28%,transparent_70%,rgba(139,92,246,0.08))]" />

              {/* Oscurecimiento interior original */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_25px_rgba(0,0,0,0.85)]" />
            </div>
          </div>

          {/* 
            BASE DE LA LAPTOP CORREGIDA

            - Antes tenía w-[104%].
            - Ahora tiene w-[101%].
            - Los extremos se desvanecen.
            - Ya no aparecen cortes verticales.
          */}
          <div className="relative mx-auto h-[13px] w-[101%] rounded-b-[55%] bg-gradient-to-b from-[#302945] via-[#171320] to-[#08070b] [mask-image:linear-gradient(to_right,transparent_0%,black_7%,black_93%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_7%,black_93%,transparent_100%)] sm:h-[20px]">
            {/* Hendidura central */}
            <div className="absolute left-1/2 top-0 h-[3px] w-[18%] -translate-x-1/2 rounded-b-full bg-black/45 sm:h-[5px]" />
          </div>
        </div>

        {/* ============================== */}
        {/* CELULAR */}
        {/* ============================== */}

        <div className="absolute bottom-[-3%] right-[1%] z-30 w-[25%] min-w-[92px] max-w-[175px] rotate-[2.5deg] sm:right-[2%]">
          <div className="relative rounded-[22px] border border-white/25 bg-gradient-to-br from-[#41395a] via-[#171321] to-[#050507] p-[4px] shadow-[0_24px_55px_rgba(0,0,0,0.62),0_0_20px_rgba(124,58,237,0.1)] sm:rounded-[32px] sm:p-[6px]">
            {/* Botones laterales */}
            <div className="absolute -left-[3px] top-[22%] h-[13%] w-[3px] rounded-l bg-[#2b253b]" />

            <div className="absolute -left-[3px] top-[38%] h-[9%] w-[3px] rounded-l bg-[#2b253b]" />

            {/* Pantalla celular */}
            <div className="relative aspect-[9/19] overflow-hidden rounded-[18px] bg-[#080510] sm:rounded-[26px]">
              {/* Isla superior */}
              <div className="absolute left-1/2 top-[5px] z-40 h-[10px] w-[38%] -translate-x-1/2 rounded-full bg-black sm:top-[7px] sm:h-[14px]" />

              <MobileScreen />

              {/* Reflejo original */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_30%,transparent_72%,rgba(139,92,246,0.08))]" />

              {/* Oscurecimiento interior original */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_14px_rgba(0,0,0,0.8)]" />
            </div>
          </div>
        </div>

        {/* Sombra inferior original */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[9%] left-[8%] -z-10 h-[14%] w-[80%] rounded-full bg-black/60 blur-2xl"
        />
      </div>
    </div>
  );
}

function DesktopScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#090611]">
      <div className="desktop-screen-scroll absolute inset-x-0 top-0">
        {/* Header */}
        <div className="flex h-10 items-center justify-between border-b border-white/5 bg-[#0e0918] px-4 sm:h-14 sm:px-6">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400/80 sm:h-2 sm:w-2" />

            <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70 sm:h-2 sm:w-2" />

            <span className="h-1.5 w-1.5 rounded-full bg-purple-300/50 sm:h-2 sm:w-2" />
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-10 rounded-full bg-violet-500 sm:h-3 sm:w-16" />

            <span className="h-2 w-6 rounded-full bg-white/10 sm:h-3 sm:w-9" />
          </div>
        </div>

        {/* Hero interior */}
        <div className="grid min-h-[210px] grid-cols-[1.1fr_0.9fr] items-center gap-4 bg-[radial-gradient(circle_at_25%_30%,rgba(124,58,237,0.28),transparent_42%),#0b0712] px-5 py-7 sm:min-h-[330px] sm:gap-8 sm:px-9 sm:py-12">
          <div>
            <div className="h-2 w-16 rounded-full bg-violet-400/70 sm:h-3 sm:w-24" />

            <div className="mt-4 h-5 w-[88%] rounded bg-white/90 sm:h-8" />

            <div className="mt-2 h-5 w-[72%] rounded bg-white/50 sm:h-8" />

            <div className="mt-4 h-2 w-[82%] rounded-full bg-white/20 sm:h-3" />

            <div className="mt-2 h-2 w-[66%] rounded-full bg-white/15 sm:h-3" />

            <div className="mt-5 h-6 w-20 rounded-full bg-violet-600 shadow-[0_8px_20px_rgba(124,58,237,0.35)] sm:h-9 sm:w-28" />
          </div>

          <div className="relative aspect-square rounded-[18px] border border-white/10 bg-gradient-to-br from-violet-600/30 to-fuchsia-500/5 shadow-[inset_0_0_35px_rgba(124,58,237,0.15)] sm:rounded-[28px]">
            <div className="absolute inset-[14%] rounded-[14px] border border-white/10 bg-[#110b1c] sm:rounded-[22px]">
              <div className="absolute left-[10%] top-[15%] h-[8%] w-[45%] rounded-full bg-violet-500" />

              <div className="absolute left-[10%] top-[34%] h-[5%] w-[70%] rounded-full bg-white/15" />

              <div className="absolute left-[10%] top-[47%] h-[5%] w-[58%] rounded-full bg-white/10" />

              <div className="absolute bottom-[13%] left-[10%] h-[18%] w-[32%] rounded-lg bg-fuchsia-500/50" />

              <div className="absolute bottom-[13%] right-[10%] h-[18%] w-[42%] rounded-lg bg-violet-500/30" />
            </div>
          </div>
        </div>

        {/* Servicios */}
        <div className="bg-[#100919] px-5 py-7 sm:px-9 sm:py-12">
          <div className="mx-auto h-4 w-[38%] rounded-full bg-white/80 sm:h-6" />

          <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-9 sm:gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/8 bg-white/[0.035] p-3 sm:rounded-2xl sm:p-5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/50 sm:h-10 sm:w-10">
                  <div className="h-2.5 w-2.5 rotate-45 rounded-sm border border-white/70 sm:h-4 sm:w-4" />
                </div>

                <div className="mt-3 h-2.5 w-[65%] rounded-full bg-white/60 sm:h-4" />

                <div className="mt-2 h-1.5 w-full rounded-full bg-white/12 sm:h-2.5" />

                <div className="mt-1.5 h-1.5 w-[78%] rounded-full bg-white/10 sm:h-2.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Proyectos */}
        <div className="bg-[#0b0612] px-5 py-8 sm:px-9 sm:py-12">
          <div className="h-4 w-[30%] rounded-full bg-white/80 sm:h-6" />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-white/8 bg-[#160d21] sm:rounded-2xl"
              >
                <div className="aspect-[16/9] bg-[linear-gradient(135deg,rgba(124,58,237,0.5),rgba(236,72,153,0.12),rgba(8,5,16,1))]" />

                <div className="p-3 sm:p-4">
                  <div className="h-2.5 w-[55%] rounded-full bg-white/60 sm:h-3.5" />

                  <div className="mt-2 h-1.5 w-[85%] rounded-full bg-white/10 sm:h-2.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="flex min-h-[170px] flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.24),transparent_60%),#0d0715] px-8 text-center sm:min-h-[260px]">
          <div className="h-4 w-[45%] rounded-full bg-white/80 sm:h-7" />

          <div className="mt-3 h-2 w-[62%] rounded-full bg-white/15 sm:h-3" />

          <div className="mt-5 h-7 w-24 rounded-full bg-violet-600 sm:h-10 sm:w-36" />
        </div>
      </div>
    </div>
  );
}

function MobileScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#090611]">
      <div className="mobile-screen-scroll absolute inset-x-0 top-0">
        {/* Header */}
        <div className="flex h-8 items-center justify-between border-b border-white/5 bg-[#0e0918] px-3 sm:h-11">
          <div className="flex flex-col gap-[2px]">
            <span className="h-[1px] w-3 bg-white/60 sm:w-4" />

            <span className="h-[1px] w-3 bg-white/60 sm:w-4" />

            <span className="h-[1px] w-3 bg-white/60 sm:w-4" />
          </div>

          <span className="h-1.5 w-7 rounded-full bg-violet-500 sm:h-2 sm:w-9" />
        </div>

        {/* Hero */}
        <div className="flex min-h-[170px] flex-col justify-center bg-[radial-gradient(circle_at_50%_25%,rgba(124,58,237,0.3),transparent_50%),#0b0712] px-3 py-7 sm:min-h-[245px] sm:px-5">
          <div className="h-1.5 w-10 rounded-full bg-violet-400/70 sm:h-2 sm:w-14" />

          <div className="mt-3 h-4 w-[90%] rounded bg-white/85 sm:h-6" />

          <div className="mt-1.5 h-4 w-[68%] rounded bg-white/45 sm:h-6" />

          <div className="mt-3 h-1.5 w-[85%] rounded-full bg-white/15 sm:h-2" />

          <div className="mt-1.5 h-1.5 w-[62%] rounded-full bg-white/10 sm:h-2" />

          <div className="mt-4 h-5 w-14 rounded-full bg-violet-600 sm:h-7 sm:w-20" />
        </div>

        {/* Tarjetas */}
        <div className="space-y-2 bg-[#100919] px-3 py-5 sm:space-y-3 sm:px-4 sm:py-7">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-white/8 bg-white/[0.035] p-3 sm:rounded-xl sm:p-4"
            >
              <div className="h-5 w-5 rounded-md bg-violet-600/50 sm:h-7 sm:w-7" />

              <div className="mt-2 h-1.5 w-[55%] rounded-full bg-white/60 sm:h-2" />

              <div className="mt-1.5 h-1 w-full rounded-full bg-white/10 sm:h-1.5" />

              <div className="mt-1 h-1 w-[75%] rounded-full bg-white/10 sm:h-1.5" />
            </div>
          ))}
        </div>

        {/* Proyectos */}
        <div className="space-y-2 bg-[#0b0612] px-3 py-5 sm:space-y-3 sm:px-4 sm:py-7">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-lg border border-white/8 bg-[#160d21] sm:rounded-xl"
            >
              <div className="aspect-[16/9] bg-[linear-gradient(135deg,rgba(124,58,237,0.5),rgba(236,72,153,0.12),rgba(8,5,16,1))]" />

              <div className="p-2.5 sm:p-3">
                <div className="h-1.5 w-[55%] rounded-full bg-white/60 sm:h-2" />

                <div className="mt-1.5 h-1 w-[85%] rounded-full bg-white/10 sm:h-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <div className="flex min-h-[120px] flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.25),transparent_60%),#0d0715] px-3 sm:min-h-[180px]">
          <div className="h-2.5 w-[55%] rounded-full bg-white/75 sm:h-4" />

          <div className="mt-2 h-1.5 w-[75%] rounded-full bg-white/12 sm:h-2" />

          <div className="mt-4 h-5 w-16 rounded-full bg-violet-600 sm:h-7 sm:w-24" />
        </div>
      </div>
    </div>
  );
}