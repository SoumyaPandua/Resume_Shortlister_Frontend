// lib/mockLLM.js
export async function mockLLMResponse() {
  return {
    results: [
      {
        resumeName: 'resume1.pdf',
        software_developer: {
          Skills: {
            match_pct: 60.0,
            resume_value: 'Python, Java, Docker',
            job_description_value: 'Python, R, ML',
            explanation: 'Some overlap, missing ML tools.',
          },
          Education: {
            match_pct: 80.0,
            resume_value: 'B.Tech CS, IIT',
            job_description_value: 'BTech, MCA, MStat',
            explanation: 'Matches core CS degree.',
          },
          'Job Role': {
            match_pct: 40.0,
            resume_value: 'Software Developer',
            job_description_value: 'Data Scientist',
            explanation: 'Different domains.',
          },
          Experience: {
            match_pct: 20.0,
            resume_value: 'Internship only',
            job_description_value: '2+ years experience',
            explanation: 'Internship doesn’t meet requirement.',
          },
          OverallMatchPercentage: 72.5,
          why_overall_match_is_this: 'Education helps, but job mismatch lowers it.',
          AI_Generated_Estimate_Percentage: 15.0,
        },
      },
      {
        resumeName: 'resume2.pdf',
        software_developer: {
          Skills: {
            match_pct: 90.0,
            resume_value: 'Python, ML, R',
            job_description_value: 'Python, R, ML',
            explanation: 'Perfect skill match.',
          },
          Education: {
            match_pct: 85.0,
            resume_value: 'MCA',
            job_description_value: 'BTech, MCA, MStat',
            explanation: 'MCA is accepted.',
          },
          'Job Role': {
            match_pct: 70.0,
            resume_value: 'Data Scientist',
            job_description_value: 'Software engineer',
            explanation: 'Good role match.',
          },
          Experience: {
            match_pct: 80.0,
            resume_value: '2 years experience',
            job_description_value: '2+ years experience',
            explanation: 'Matches well.',
          },
          OverallMatchPercentage: 91.2,
          why_overall_match_is_this: 'Strong match across all sections.',
          AI_Generated_Estimate_Percentage: 5.0,
        },
      },
    ],
  };
}