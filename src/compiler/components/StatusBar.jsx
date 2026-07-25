/**
 * Status bar — displays editor info and runtime status.
 */
export function StatusBar({ language, lineCount }) {
  return (
    <div className="compiler-statusbar">
      <div className="compiler-statusbar-left">
        <span className="compiler-status-indicator" />
        <span>Client-Side Runtime</span>
      </div>
      <div className="compiler-statusbar-right">
        <span>{language}</span>
        <span className="compiler-statusbar-sep">|</span>
        <span>{lineCount} lines</span>
        <span className="compiler-statusbar-sep">|</span>
        <span>Browser Native</span>
      </div>
    </div>
  );
}
