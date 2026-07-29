import React from "react";

interface IEmptyTableProps {
  message?: string;
  description?: string;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  height?: string;
}

const EmptyTable: React.FC<IEmptyTableProps> = ({ message, description, extra, icon, height = "200px" }) => (
  <section className="relative py-4 flex flex-col items-center justify-center gap-3" style={{ height }}>
    {icon && <div className="mx-auto text-center flex justify-center">{icon}</div>}
    {(message || description) && (
      <div>
        {message && <p className="text-sm md:text-lg text-gray-900 font-bold text-center">{message}</p>}
        {description && <p className="text-base text-gray-500 text-center">{description}</p>}
      </div>
    )}
    {extra}
  </section>
);

export default EmptyTable;