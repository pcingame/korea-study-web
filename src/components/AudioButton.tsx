import { SpeakerHigh } from "@phosphor-icons/react";

// Web Speech API: giọng đọc tùy trình duyệt/hệ điều hành
export function speak(text: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ko-KR";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

export default function AudioButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      aria-label={`Nghe ${text}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-primary transition duration-150 hover:bg-soft active:scale-95"
    >
      <SpeakerHigh size={22} weight="bold" />
    </button>
  );
}
