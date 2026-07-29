import React from "react";
import { Button } from "antd";

interface IErrorStateProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
  height?: string;
}

const ErrorState: React.FC<IErrorStateProps> = ({
  message = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
  height = "200px",
}) => (
  <section className="relative py-4 flex flex-col items-center justify-center gap-3" style={{ height }}>
    <div>
      <p className="text-sm md:text-lg text-red-600 font-bold text-center">{message}</p>
      <p className="text-base text-gray-500 text-center">{description}</p>
    </div>
    {onRetry && (
      <Button danger onClick={onRetry}>
        Retry
      </Button>
    )}
  </section>
);

export default ErrorState;