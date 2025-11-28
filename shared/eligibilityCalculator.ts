import type { Submission } from './schema';

interface EligibilityResult {
  score: number;
  isEligible: boolean;
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
  resultCategory: 'high' | 'moderate' | 'low';
  recommendations: string[];
}

export function calculateEligibilityScore(submission: Partial<Submission>): EligibilityResult {
  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [
    'An immediate consultation with a visa specialist is recommended.',
    'Validate your personalized AI report with your visa consultant.'
  ];
  const recommendations: string[] = [];

  const ieltsScore = calculateIELTSScore(submission, strengths, weaknesses, recommendations);
  const academicScore = calculateAcademicScore(submission, strengths, weaknesses, recommendations);
  const courseTypeScore = calculateCourseTypeScore(submission, strengths, weaknesses, recommendations);
  const institutionScore = calculateInstitutionScore(submission, strengths, weaknesses);
  const gapScore = calculateGapYearsScore(submission, strengths, weaknesses, recommendations);
  const bonusScore = calculateBonusScore(submission, strengths);

  score = ieltsScore + academicScore + courseTypeScore + institutionScore + gapScore + bonusScore;

  const penalties = calculatePenalties(submission, weaknesses);
  score = Math.max(0, score + penalties);

  score = Math.min(Math.max(score, 0), 100);

  // Never show 100% - cap at 90%
  if (score >= 100) {
    score = 90;
  }

  // Generic AI recommendations (used only if no profile-specific recommendations exist)
  const genericRecommendations = [
    'Work with a counselor to craft a compelling and well-structured SOP',
    'Prepare comprehensive financial documentation to demonstrate funding stability',
    'Practice answering common visa interview questions to boost your confidence'
  ];

  // If no profile-specific recommendations, add at least 1 generic recommendation
  if (recommendations.length === 0) {
    const randomIndex = Math.floor(Math.random() * genericRecommendations.length);
    recommendations.push(genericRecommendations[randomIndex]);
  }

  const resultCategory = score >= 85 ? 'high' : score >= 60 ? 'moderate' : 'low';
  const isEligible = score >= 60;
  const suggestion = generateSuggestion(score, resultCategory, weaknesses);

  return {
    score,
    isEligible,
    strengths,
    weaknesses,
    suggestion,
    resultCategory,
    recommendations,
  };
}

function calculateIELTSScore(
  submission: Partial<Submission>,
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const { hasLanguageTest, languageTest, ieltsScore } = submission;

  // IELTS - Full points (preferred test)
  if (hasLanguageTest === 'yes' && languageTest === 'ielts' && ieltsScore) {
    const overallScore = parseFloat(ieltsScore);
    
    if (overallScore >= 6.5) {
      score = 30;
      strengths.push(`Excellent IELTS score (${overallScore})`);
    } else if (overallScore >= 6.0) {
      score = 25;
      strengths.push(`Good IELTS score (${overallScore})`);
    } else if (overallScore >= 5.5) {
      score = 15;
      weaknesses.push(`IELTS score is acceptable but could be higher (${overallScore})`);
      recommendations.push('Retake IELTS and aim for 6.5+ to increase your visa approval chances');
    } else {
      score = 5;
      weaknesses.push(`Low IELTS score (${overallScore})`);
      recommendations.push('Retake IELTS and aim for 6.5+ for a higher visa approval chance');
    }
  } 
  // Non-IELTS tests - Reduced points with improvement recommendation
  else if (hasLanguageTest === 'yes' && languageTest && ieltsScore) {
    const overallScore = parseFloat(ieltsScore);
    
    if (languageTest === 'toefl') {
      // TOEFL - Reduced points (max 20 instead of 30)
      if (overallScore >= 100) {
        score = 20;
        strengths.push(`Good TOEFL score (${overallScore})`);
      } else if (overallScore >= 90) {
        score = 15;
        strengths.push(`Acceptable TOEFL score (${overallScore})`);
      } else if (overallScore >= 80) {
        score = 10;
        weaknesses.push(`TOEFL score could be higher (${overallScore})`);
      } else {
        score = 5;
        weaknesses.push(`Low TOEFL score (${overallScore})`);
      }
      // Add improvement area for non-IELTS
      weaknesses.push('TOEFL is accepted but IELTS is preferred for Canadian visa applications');
      recommendations.push('Consider taking IELTS instead - it is more widely accepted and can increase your visa approval chances');
    } 
    else if (languageTest === 'pte') {
      // PTE - Reduced points (max 20 instead of 30)
      if (overallScore >= 70) {
        score = 20;
        strengths.push(`Good PTE score (${overallScore})`);
      } else if (overallScore >= 60) {
        score = 15;
        strengths.push(`Acceptable PTE score (${overallScore})`);
      } else if (overallScore >= 50) {
        score = 10;
        weaknesses.push(`PTE score could be higher (${overallScore})`);
      } else {
        score = 5;
        weaknesses.push(`Low PTE score (${overallScore})`);
      }
      // Add improvement area for non-IELTS
      weaknesses.push('PTE is accepted but IELTS is preferred for Canadian visa applications');
      recommendations.push('Consider taking IELTS instead - it is more widely accepted and can increase your visa approval chances');
    }
    else if (languageTest === 'duolingo') {
      // Duolingo - Reduced points (max 15 instead of 30)
      if (overallScore >= 120) {
        score = 15;
        strengths.push(`Good Duolingo score (${overallScore})`);
      } else if (overallScore >= 105) {
        score = 10;
        strengths.push(`Acceptable Duolingo score (${overallScore})`);
      } else if (overallScore >= 90) {
        score = 8;
        weaknesses.push(`Duolingo score could be higher (${overallScore})`);
      } else {
        score = 5;
        weaknesses.push(`Low Duolingo score (${overallScore})`);
      }
      // Add improvement area for non-IELTS
      weaknesses.push('Duolingo has limited acceptance for Canadian visa applications');
      recommendations.push('Strongly consider taking IELTS instead - Duolingo is not widely accepted and IELTS will significantly increase your visa approval chances');
    }
  } else {
    score = 0;
    weaknesses.push('No English language test provided');
    recommendations.push('IELTS is required for admission - it is the most accepted test for Canadian visa applications');
  }

  return score;
}

function calculateAcademicScore(
  submission: Partial<Submission>,
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const { educationGrade, gradeType } = submission;

  if (educationGrade) {
    const grade = parseFloat(educationGrade);
    
    let percentage = grade;
    if (gradeType === 'cgpa') {
      percentage = (grade / 10) * 100;
    }

    if (percentage >= 70) {
      score = 25;
      strengths.push(`Strong academic performance (${percentage.toFixed(1)}%)`);
    } else if (percentage >= 60) {
      score = 20;
      strengths.push(`Good academic performance (${percentage.toFixed(1)}%)`);
    } else if (percentage >= 50) {
      score = 10;
      weaknesses.push(`Academic percentage could be higher (${percentage.toFixed(1)}%)`);
      recommendations.push('Select a relevant course to balance lower academics');
    } else {
      score = 5;
      weaknesses.push(`Low academic percentage (${percentage.toFixed(1)}%)`);
      recommendations.push('Choose a more relevant course to balance low academics');
    }
  } else {
    score = 5;
    weaknesses.push('Academic grade not provided');
  }

  return score;
}

function calculateCourseTypeScore(
  submission: Partial<Submission>,
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const { courseType } = submission;

  if (courseType === 'masters') {
    score = 15;
    strengths.push('Applying for Masters program');
  } else if (courseType === 'bachelors') {
    score = 12;
    strengths.push('Applying for Bachelor\'s program');
  } else if (courseType === 'diploma' || courseType === 'pgdiploma') {
    score = 5;
    weaknesses.push('Diploma/PG Diploma programs have lower approval rates');
    recommendations.push(`Diploma/PG Diploma visas have very low approval as per IRCC ${new Date().getFullYear()}. Prefer Masters or Undergraduate programs`);
  } else {
    score = 12;
  }

  return score;
}

function calculateInstitutionScore(
  submission: Partial<Submission>,
  strengths: string[],
  weaknesses: string[]
): number {
  let score = 0;
  const { institutionType } = submission;

  if (institutionType === 'public') {
    score = 10;
    strengths.push('Applying to public university');
  } else if (institutionType === 'private') {
    score = 5;
    weaknesses.push('Private institution - approval rates may be lower');
  } else {
    score = 10;
  }

  return score;
}

function calculateGapYearsScore(
  submission: Partial<Submission>,
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const { gapYears } = submission;

  if (gapYears) {
    const gap = parseInt(gapYears);
    
    if (gap === 0) {
      score = 10;
      strengths.push('No gap in education');
    } else if (gap <= 2) {
      score = 8;
      strengths.push(`Minimal gap (${gap} year${gap > 1 ? 's' : ''})`);
    } else {
      score = 5;
      weaknesses.push(`Significant gap in education (${gap} years)`);
      recommendations.push('Prepare a strong SOP or Work Experience justification to cover long gap');
    }
  } else {
    score = 10;
  }

  return score;
}

function calculateBonusScore(
  submission: Partial<Submission>,
  strengths: string[]
): number {
  let score = 0;
  const { proofOfFunds, strongSOP, publicUniversityLOA } = submission;

  if (proofOfFunds === 'yes') {
    score += 5;
    strengths.push('Proof of funds ready');
  }

  if (strongSOP === 'yes') {
    score += 5;
    strengths.push('Strong SOP prepared');
  }

  if (publicUniversityLOA === 'yes') {
    score += 5;
    strengths.push('Public university LOA received');
  }

  return score;
}

function calculatePenalties(
  submission: Partial<Submission>,
  weaknesses: string[]
): number {
  let penalty = 0;
  const { courseType, institutionType } = submission;

  const isDiploma = courseType === 'diploma' || courseType === 'pgdiploma';
  const isPrivate = institutionType === 'private';

  if (isDiploma) {
    penalty -= 2;
    weaknesses.push(`IRCC ${new Date().getFullYear()}: -2 points for Diploma/PG Diploma programs`);
    
    if (isPrivate) {
      penalty -= 3;
      weaknesses.push(`IRCC ${new Date().getFullYear()}: Additional -3 points for Private institution + Diploma combination`);
    }
  }

  return penalty;
}

function generateSuggestion(score: number, category: string, weaknesses: string[]): string {
  if (category === 'high') {
    return `Excellent! You have high visa approval chances as per IRCC ${new Date().getFullYear()} guidelines. Your application is highly competitive.`;
  } else if (category === 'moderate') {
    return 'Good! You have moderate visa approval chances. Consider addressing the areas mentioned to strengthen your application further.';
  } else {
    return 'Your profile needs improvement before applying. Focus on strengthening weak areas first. Our counselors can provide personalized guidance.';
  }
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface RecommendationCounts {
  universities: number;
  programs: number;
}

export function getRecommendationCounts(eligibilityScore: number): RecommendationCounts {
  let universityMin: number, universityMax: number;
  let programMin: number, programMax: number;

  if (eligibilityScore >= 75) {
    universityMin = 20;
    universityMax = 30;
    programMin = 10;
    programMax = 15;
  } else if (eligibilityScore >= 60) {
    universityMin = 15;
    universityMax = 20;
    programMin = 7;
    programMax = 12;
  } else if (eligibilityScore >= 45) {
    universityMin = 12;
    universityMax = 15;
    programMin = 8;
    programMax = 10;
  } else {
    universityMin = 5;
    universityMax = 8;
    programMin = 3;
    programMax = 5;
  }

  return {
    universities: getRandomInRange(universityMin, universityMax),
    programs: getRandomInRange(programMin, programMax),
  };
}
