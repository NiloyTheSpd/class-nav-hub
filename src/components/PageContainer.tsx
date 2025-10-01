import { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  children?: ReactNode;
}

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}
