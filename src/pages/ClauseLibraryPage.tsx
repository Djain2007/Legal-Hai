import { BookOpen } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export function ClauseLibraryPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1280px] mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-primary" />
            Clause Library
          </h1>
          <p className="text-lg text-on-surface-variant">
            Your personal library of standard and extracted clauses.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
          <BookOpen className="w-16 h-16 text-outline-variant mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">Clause Library is Empty</h2>
          <p className="text-on-surface-variant max-w-md">
            Analyze contracts to start building your clause library.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
