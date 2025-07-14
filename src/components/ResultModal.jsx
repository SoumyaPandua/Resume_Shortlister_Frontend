export default function ResultModal({ result, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-2 mt-1">Analysis Details</h2>
        <p><strong>Resume:</strong> {result.resumeName}</p>
        <p><strong>Job Description:</strong> {result.jdName}</p>

        <div className="space-y-4 mt-4 text-sm">
          <div>
            <strong>Skill Match:</strong> {result.skillsMatch}%  
            <p className="text-gray-600">Reason: {result.skillsReason}</p>
            <p className="text-gray-600">Resume Value: {result.skillsResumeValue}</p>
            <p className="text-gray-600">JD Value: {result.skillsJDValue}</p>
          </div>
          <div>
            <strong>Job Role Match:</strong> {result.jobRoleMatch}%
            <p className="text-gray-600">Reason: {result.jobRoleReason}</p>
            <p className="text-gray-600">Resume Value: {result.jobRoleResumeValue}</p>
            <p className="text-gray-600">JD Value: {result.jobRoleJDValue}</p>
          </div>
          <div>
            <strong>Education Match:</strong> {result.educationMatch}%
            <p className="text-gray-600">Reason: {result.educationReason}</p>
            <p className="text-gray-600">Resume Value: {result.educationResumeValue}</p>
            <p className="text-gray-600">JD Value: {result.educationJDValue}</p>
          </div>
          <div>
            <strong>Experience Match:</strong> {result.experienceMatch}%
            <p className="text-gray-600">Reason: {result.experienceReason}</p>
            <p className="text-gray-600">Resume Value: {result.experienceResumeValue}</p>
            <p className="text-gray-600">JD Value: {result.experienceJDValue}</p>
          </div>
          <div>
            <strong>Overall Match:</strong> {result.overallScore}%
            <p className="text-gray-600">Reason: {result.overallExplanation}</p>
          </div>
          <div>
            <strong>AI Estimate:</strong> {result.aiEstimate}%
            <br />
            <strong>Shortlisted:</strong> {result.shortlisted ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    </div>
  );
}