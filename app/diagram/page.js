import DiagramCanvas from '../../components/DiagramCanvas';
import Sidebar from '../../components/Sidebar';

export default function DiagramPage() {
  return (
    <div className="diagram-page">
      <h1>Create Diagram</h1>
      <div className="diagram-layout">
        
        <DiagramCanvas />
      </div>
    </div>
  );
}