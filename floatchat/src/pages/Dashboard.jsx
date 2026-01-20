export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-900 p-6 rounded">Total Floats</div>
      <div className="bg-slate-900 p-6 rounded">Active Profiles</div>
      <div className="bg-slate-900 p-6 rounded">Latest Update</div>
    </div>
  );
}
