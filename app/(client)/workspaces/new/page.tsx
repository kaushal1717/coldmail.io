import { CreateWorkspaceForm } from "@/components/workspace/CreateWorkspaceForm";

export default function NewWorkspacePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Create New Workspace</h1>
        <p className="text-muted-foreground text-center mt-2">
          Set up a collaborative space for your team
        </p>
      </div>

      <CreateWorkspaceForm />
    </div>
  );
}
