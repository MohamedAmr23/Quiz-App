import QuestionsTable from "@/features/questions/components/QuestionsTable";
import { Plus } from "lucide-react";

export default function Questions() {
  return (
    <div className="my-3 p-2">
      <div className="p-3 shadow-2xl border rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Questions</h1>

          <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-gray-300 hover:shadow">
            <Plus size={16} />
            Add Question
          </button>
        </div>
        <div className="qustion-table bg-amber-500">
          <QuestionsTable />
        </div>
      </div>
    </div>
  );
}
