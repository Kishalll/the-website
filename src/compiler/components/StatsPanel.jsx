/**
 * Execution statistics panel.
 */
export function StatsPanel({ result, isRunning }) {
  if (!result && !isRunning) {
    return (
      <div className="compiler-panel">
        <div className="compiler-panel-header">
          <span className="compiler-panel-title">Statistics</span>
        </div>
        <div className="compiler-panel-empty">No execution data yet</div>
      </div>
    );
  }

  if (isRunning && !result) {
    return (
      <div className="compiler-panel">
        <div className="compiler-panel-header">
          <span className="compiler-panel-title">Statistics</span>
        </div>
        <div className="compiler-panel-empty">⏳ Running...</div>
      </div>
    );
  }

  if (!result) return null;

  const stats = [
    {
      label: "Status",
      value: result.status === "success" ? "✅ Success" : result.status === "timeout" ? "⏰ Timeout" : "❌ Error",
      icon: "📊",
    },
    {
      label: "Time",
      value: result.executionTimeMs > 0 ? `${result.executionTimeMs}ms` : "—",
      icon: "⏱️",
    },
    {
      label: "Runtime",
      value: result.runtime || "—",
      icon: "⚙️",
    },
    {
      label: "Timestamp",
      value: new Date(result.timestamp).toLocaleTimeString(),
      icon: "🕐",
    },
  ];

  return (
    <div className="compiler-panel">
      <div className="compiler-panel-header">
        <span className="compiler-panel-title">Statistics</span>
      </div>
      <div className="compiler-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="compiler-stat-item">
            <span className="compiler-stat-icon">{stat.icon}</span>
            <div className="compiler-stat-info">
              <span className="compiler-stat-label">{stat.label}</span>
              <span className="compiler-stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
