import Plot from "react-plotly.js";

/**
 * Temperature vs Depth plot for ARGO profiles
 * Backend-ready: replace static data with API response later
 */
export default function TemperaturePlot() {
  return (
    <Plot
      data={[
        {
          x: [26.5, 24.2, 18.7, 12.1, 6.4],
          y: [0, 100, 300, 700, 1500],
          type: "scatter",
          mode: "lines+markers",
          line: { width: 3 },
          marker: { size: 6 },
          name: "Temperature Profile",
        },
      ]}
      layout={{
        title: "Temperature vs Depth",
        xaxis: {
          title: "Temperature (°C)",
          gridcolor: "#1e293b",
        },
        yaxis: {
          title: "Depth (m)",
          autorange: "reversed",
          gridcolor: "#1e293b",
        },
        paper_bgcolor: "#020617",
        plot_bgcolor: "#020617",
        font: { color: "#e5e7eb" },
        margin: { l: 60, r: 20, t: 50, b: 50 },
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
    />
  );
}
