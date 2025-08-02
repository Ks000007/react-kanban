import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { Navbar } from "../components/layout/Navbar";

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <KanbanBoard />
    </div>
  );
};
