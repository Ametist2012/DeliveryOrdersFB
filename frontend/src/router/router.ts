
type Listener = () => void;

const listeners = new Set<Listener>();

export function getPath(): string {
  return window.location.pathname;
}

export function navigate(path: string): void {
  if (path === getPath()) return;
  window.history.pushState({}, "", path);
  listeners.forEach((l) => l());
}

// Меняет URL без добавления записи в историю — используем для редиректов
// (например, "/" -> "/orders", или когда не-админ вручную набрал "/admin").
export function replace(path: string): void {
  window.history.replaceState({}, "", path);
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}
