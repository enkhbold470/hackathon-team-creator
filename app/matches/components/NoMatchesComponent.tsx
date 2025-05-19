interface NoMatchesComponentProps {
  title: string;
  message: string;
}

export default function NoMatchesComponent({ title, message }: NoMatchesComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
} 