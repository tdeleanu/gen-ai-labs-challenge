import { IoInformationCircleOutline } from "react-icons/io5";

interface InfoTooltipProps {
  title: string;
  description: string;
}

export default function InfoTooltip({ title, description }: InfoTooltipProps) {
  return (
    <div className="group relative">
      <IoInformationCircleOutline className="w-4 h-4 text-blue-500 hover:text-blue-600 cursor-help transition-colors" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-10">
        <div className="font-semibold mb-1">{title}</div>
        <div>{description}</div>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
