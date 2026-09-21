import { BookOpenText, Books, Cards, ChartBar, Exam, House, Microphone, TextAa } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import Flashcard from "./pages/Flashcard";
import Grammar from "./pages/Grammar";
import Hangul from "./pages/Hangul";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Pronunciation from "./pages/Pronunciation";
import Quiz from "./pages/Quiz";
import Vocabulary from "./pages/Vocabulary";

// mobile: true = hiện ở thanh dưới điện thoại (tối đa 5 mục); mục còn lại vào từ Trang chủ hoặc sidebar
const NAV = [
  { to: "/", Icon: House, text: "Trang chủ", mobile: true },
  { to: "/hangul", Icon: TextAa, text: "Hangul", mobile: false },
  { to: "/vocabulary", Icon: Books, text: "Từ vựng", mobile: true },
  { to: "/grammar", Icon: BookOpenText, text: "Ngữ pháp", mobile: true },
  { to: "/flashcard", Icon: Cards, text: "Flashcard", mobile: true },
  { to: "/quiz", Icon: Exam, text: "Quiz", mobile: true },
  { to: "/pronunciation", Icon: Microphone, text: "Phát âm", mobile: false },
  { to: "/progress", Icon: ChartBar, text: "Tiến độ", mobile: false },
];

export default function App() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  // Đổi trang: cuộn lên đầu và đưa focus vào nội dung (hỗ trợ bàn phím/trình đọc màn hình)
  useEffect(() => {
    if (first.current) return void (first.current = false);
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="min-h-dvh md:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-primary focus:p-2 focus:text-on-primary">
        Bỏ qua điều hướng
      </a>
      <nav
        aria-label="Chính"
        className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-border bg-surface px-1 pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:flex md:h-dvh md:w-56 md:shrink-0 md:flex-col md:gap-1 md:border-r md:border-t-0 md:p-3"
      >
        <div className="hidden items-center gap-2 p-2 pb-4 md:flex">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-lg font-extrabold text-on-primary">한</span>
          <span className="font-display text-lg font-extrabold">Korean Study</span>
        </div>
        {NAV.map(({ to, Icon, text, mobile }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium transition duration-150 md:min-h-11 md:flex-row md:justify-start md:gap-3 md:px-3 md:text-base ${
                mobile ? "" : "hidden md:flex"
              } ${isActive ? "bg-soft text-primary" : "text-muted hover:bg-soft"}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={24} weight={isActive ? "fill" : "regular"} />
                {text}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <main id="main" ref={main} tabIndex={-1} className="mx-auto w-full max-w-4xl flex-1 p-4 pb-24 outline-none md:p-8">
        <div key={pathname} className="enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hangul" element={<Hangul />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/flashcard" element={<Flashcard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/pronunciation" element={<Pronunciation />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
        </div>
      </main>
    </div>
  );
}
