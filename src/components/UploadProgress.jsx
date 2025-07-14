export default function UploadProgress({ progress }) {
  if (progress === 0) return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mt-4 transition-all">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}