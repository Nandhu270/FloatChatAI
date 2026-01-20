import ArgoMap from "../components/Map/ArgoMap";
import SalinityPlot from "../components/Charts/SalinityPlot";
import TemperaturePlot from "../components/Charts/TemperaturePlot";

export default function Visualization() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ArgoMap />
      <SalinityPlot />
      <TemperaturePlot />
    </div>
  );
}
