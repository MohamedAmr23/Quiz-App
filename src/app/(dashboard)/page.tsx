import Quizzes from "@/features/dashboard/components/Quizzes";
import TopStudents from "@/features/dashboard/components/TopStudents";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 px-6 py-6">
      <Quizzes />
      <TopStudents />
    </div>
  );
}
