export function load<T extends object>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? { ...fallback, ...JSON.parse(s) } : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage bị chặn hoặc đầy: bỏ qua, app vẫn chạy
  }
}
