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
      className="rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-100"
    >
      🔊
    </button>
  );
}
