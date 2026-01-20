import Plot from "react-plotly.js";

export default function SalinityPlot() {
  return (
    <Plot
      data={[
        {
          x: [34, 35, 36],
          y: [0, 500, 1000],
          type: "scatter",
          mode: "lines",
        },
      ]}
      layout={{
        title: "Salinity vs Depth",
        yaxis: { autorange: "reversed" },
        paper_bgcolor: "#020617",
        plot_bgcolor: "#020617",
        font: { color: "#e5e7eb" },
      }}
    />
  );
}
