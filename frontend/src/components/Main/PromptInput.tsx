interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function PromptInput({
  value,
  onChange,
  placeholder = "e.g., Explain quantum computing in simple terms for a 10-year-old",
  rows = 4,
}: PromptInputProps) {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-semibold text-gray-900 mb-3">
        Ask Anything
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
      />
    </div>
  );
}
