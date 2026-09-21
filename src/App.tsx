import { NavLink, Route, Routes } from "react-router-dom";
import Flashcard from "./pages/Flashcard";
import Grammar from "./pages/Grammar";
import Hangul from "./pages/Hangul";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Quiz from "./pages/Quiz";
import Vocabulary from "./pages/Vocabulary";

const NAV = [
  ["/", "🏠", "Trang chủ"],
  ["/hangul", "🔤", "Hangul"],
  ["/vocabulary", "📚", "Từ vựng"],
  ["/grammar", "📖", "Ngữ pháp"],
  ["/flashcard", "🔄", "Flashcard"],
  ["/quiz", "📝", "Quiz"],
  ["/progress", "📊", "Tiến độ"],
];

const link = ({ isActive }: { isActive: boolean }) => (isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100");

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-7 border-t border-slate-200 bg-white md:static md:block md:w-52 md:border-r md:border-t-0 md:p-3">
        <div className="hidden p-2 text-lg font-bold md:block">🇰🇷 Korean Study</div>
        {NAV.map(([to, icon, text]) => (
          <NavLink key={to} to={to} end={to === "/"} className={(s) => `flex flex-col items-center rounded-lg p-2 text-[10px] md:flex-row md:gap-2 md:text-base ${link(s)}`}>
            <span className="text-lg">{icon}</span>
            {text}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 p-4 pb-24 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hangul" element={<Hangul />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/flashcard" element={<Flashcard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>
    </div>
  );
}
