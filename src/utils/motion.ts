import type { CSSProperties } from "react";

// Độ trễ hiện lần lượt cho danh sách; chặn ở 8 để danh sách dài không phải chờ lâu
export const stagger = (i: number) => ({ "--i": Math.min(i, 8) }) as CSSProperties;
