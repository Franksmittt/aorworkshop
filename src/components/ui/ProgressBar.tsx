interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar = ({ progress, className = '' }: ProgressBarProps) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full bg-gray-700 rounded-full h-2.5 ${className}`}>
      <div
        className="bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;