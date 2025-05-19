import { Button } from "@/components/ui/button";

interface ErrorComponentProps {
  error: string | null;
  onRetry: () => void;
}

export default function ErrorComponent({ error, onRetry }: ErrorComponentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      </div>
    </div>
  );
} 