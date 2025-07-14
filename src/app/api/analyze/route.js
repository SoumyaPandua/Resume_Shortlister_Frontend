import { prisma } from '@/db';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

export const config = {
  runtime: 'nodejs',
};

export async function POST(req) {
  const formData = await req.formData();
  const jdFile = formData.get('jd');
  const resumeFiles = formData.getAll('resumes');

  const jdId = uuid();
  const jdName = jdFile.name;
  const jdPath = path.join(os.tmpdir(), `${jdId}-${jdName}`);
  await fs.writeFile(jdPath, Buffer.from(await jdFile.arrayBuffer()));

  const resumeMap = new Map();

  for (const resumeFile of resumeFiles) {
    const resumeId = uuid();
    const resumeName = resumeFile.name;
    const resumePath = path.join(os.tmpdir(), `${resumeId}-${resumeName}`);
    await fs.writeFile(resumePath, Buffer.from(await resumeFile.arrayBuffer()));
    resumeMap.set(resumeName, resumePath);
  }

  // === CALL FASTAPI BACKEND ===
  let llmResults;
  try {
    const fastapiResponse = await axios.post(
      'http://localhost:8000/run-pipeline',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        // ❌ No timeout — let it run forever
      }
    );

    if (fastapiResponse.status !== 200) {
      throw new Error('Failed to run LLM pipeline.');
    }

    const data = fastapiResponse.data;
    // console.log('LLM Results Type:', typeof data.results);
    // console.log('LLM Results:', data.results);
    llmResults = data.results;
  } catch (err) {
    console.error('[ERROR] LLM Backend Error:', err);
    return NextResponse.json({ error: 'LLM analysis failed' }, { status: 500 });
  }

  const results = [];

  for (const item of llmResults) {
    const resumeKey = Object.keys(item)[0];
    const data = item[resumeKey];
    const resumeName = resumeKey.split('_vs_')[0];

    try {
      const newResult = await prisma.resumeAnalysis.create({
        data: {
          resumeName,
          jdName,
          overallScore: data.OverallMatchPercentage,
          shortlisted: data.OverallMatchPercentage > 75,
          overallExplanation: data.why_overall_match_is_this,
          aiEstimate: data.AI_Generated_Estimate_Percentage,

          skillsMatch: data.Skills.match_pct,
          skillsReason: data.Skills.explanation,
          skillsResumeValue: data.Skills.resume_value,
          skillsJDValue: data.Skills.job_description_value,

          educationMatch: data.Education.match_pct,
          educationReason: data.Education.explanation,
          educationResumeValue: data.Education.resume_value,
          educationJDValue: data.Education.job_description_value,

          jobRoleMatch: data['Job Role'].match_pct,
          jobRoleReason: data['Job Role'].explanation,
          jobRoleResumeValue: data['Job Role'].resume_value,
          jobRoleJDValue: data['Job Role'].job_description_value,

          experienceMatch: data.Experience.match_pct,
          experienceReason: data.Experience.explanation,
          experienceResumeValue: data.Experience.resume_value,
          experienceJDValue: data.Experience.job_description_value,
        },
      });

      results.push(newResult);
    } catch (err) {
      console.error(`Error saving ${resumeName}:`, err);
    } finally {
      const pathToDelete = resumeMap.get(resumeName);
      if (pathToDelete) {
        await fs.unlink(pathToDelete).catch(() => {});
      }
    }
  }

  await fs.unlink(jdPath).catch(() => {});

  return NextResponse.json({ results }, { status: 200 });
}

// import { prisma } from '@/db';
// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';
// import os from 'os';
// import { v4 as uuid } from 'uuid';
// import { mockLLMResponse } from '@/lib/mockLLM.js';

// export async function POST(req) {
//   const formData = await req.formData();
//   const jdFile = formData.get('jd');
//   const resumeFiles = formData.getAll('resumes');

//   const jdId = uuid();
//   const jdName = jdFile.name;
//   const jdPath = path.join(os.tmpdir(), `${jdId}-${jdName}`);
//   await fs.writeFile(jdPath, Buffer.from(await jdFile.arrayBuffer()));

//   const resumeMap = new Map();

//   for (const resumeFile of resumeFiles) {
//     const resumeId = uuid();
//     const resumeName = resumeFile.name;
//     const resumePath = path.join(os.tmpdir(), `${resumeId}-${resumeName}`);
//     await fs.writeFile(resumePath, Buffer.from(await resumeFile.arrayBuffer()));
//     resumeMap.set(resumeName, resumePath);
//   }

//   const { results: llmResults } = await mockLLMResponse(); // Mocked multi-resume response
//   const results = [];

//   for (const resumeData of llmResults) {
//     const resumeName = resumeData.resumeName;
//     const data = resumeData.software_developer;

//     try {
//       const newResult = await prisma.resumeAnalysis.create({
//         data: {
//           resumeName,
//           jdName,
//           overallScore: data.OverallMatchPercentage,
//           shortlisted: data.OverallMatchPercentage > 75,
//           overallExplanation: data.why_overall_match_is_this,
//           aiEstimate: data.AI_Generated_Estimate_Percentage,

//           skillsMatch: data.Skills.match_pct,
//           skillsReason: data.Skills.explanation,
//           skillsResumeValue: data.Skills.resume_value,
//           skillsJDValue: data.Skills.job_description_value,

//           educationMatch: data.Education.match_pct,
//           educationReason: data.Education.explanation,
//           educationResumeValue: data.Education.resume_value,
//           educationJDValue: data.Education.job_description_value,

//           jobRoleMatch: data['Job Role'].match_pct,
//           jobRoleReason: data['Job Role'].explanation,
//           jobRoleResumeValue: data['Job Role'].resume_value,
//           jobRoleJDValue: data['Job Role'].job_description_value,

//           experienceMatch: data.Experience.match_pct,
//           experienceReason: data.Experience.explanation,
//           experienceResumeValue: data.Experience.resume_value,
//           experienceJDValue: data.Experience.job_description_value,
//         },
//       });

//       results.push(newResult);
//     } catch (err) {
//       console.error(`Error processing ${resumeName}:`, err);
//     } finally {
//       // Clean up resume file
//       const pathToDelete = resumeMap.get(resumeName);
//       if (pathToDelete) {
//         await fs.unlink(pathToDelete).catch(() => {});
//       }
//     }
//   }

//   await fs.unlink(jdPath).catch(() => {});

//   return NextResponse.json({ results }, { status: 200 });
// }