/**
 * Standard input panel — allows users to provide stdin.
 */
import { Trash2 } from "lucide-react";

export function StdinPanel({ value, onChange }) {
  const handleClear = () => onChange("");

  return (
    <div className="compiler-panel">
      <div className="compiler-panel-header">
        <span>⌨️ Standard Input (stdin)</span>
        <button
          className="compiler-panel-btn"
          onClick={handleClear}
          disabled={!value}
          title="Clear input"
        >
          <Trash2 size={14} />
          <span>Clear</span>
        </button>
      </div>
      <textarea
        className="compiler-stdin-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter program input here..."
        rows={4}
        spellCheck={false}
      />
    </div>
  );
}
