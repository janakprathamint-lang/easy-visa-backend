import type { SpouseSubmission } from './schema';

interface SpouseEligibilityResult {
  score: number;
  isEligible: boolean;
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
  resultCategory: 'high' | 'moderate' | 'low';
  recommendations: string[];
}

export function calculateSpouseEligibilityScore(submission: Partial<SpouseSubmission> & { durationInCanada?: string }): SpouseEligibilityResult {
  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [
    'An immediate consultation with a visa specialist is recommended.',
    'Validate your personalized AI report with your visa consultant.'
  ];
  const recommendations: string[] = [];

  const permitScore = calculatePermitScore(submission, strengths, weaknesses, recommendations);
  const fundsScore = calculateFundsScore(submission, strengths, weaknesses, recommendations);
  const durationScore = calculateDurationScore(submission, strengths, weaknesses, recommendations);
  const nocScore = calculateNocScore(submission, strengths, weaknesses, recommendations);
  const creditsScore = calculateCreditsScore(submission, strengths, weaknesses, recommendations);

  score = permitScore + fundsScore + durationScore + nocScore + creditsScore;

  score = Math.min(Math.max(score, 0), 100);

  if (score >= 90) {
    score = 90;
  }

  const genericRecommendations = [
    'Work with a consultant to prepare comprehensive relationship documentation',
    'Ensure all financial documents are up-to-date and properly organized',
    'Prepare detailed photos and communication records as proof of relationship'
  ];

  if (recommendations.length === 0) {
    const randomIndex = Math.floor(Math.random() * genericRecommendations.length);
    recommendations.push(genericRecommendations[randomIndex]);
  }

  const resultCategory = score >= 85 ? 'high' : score >= 60 ? 'moderate' : 'low';
  const isEligible = score >= 60;
  const suggestion = generateSuggestion(score, resultCategory);

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

function calculatePermitScore(
  submission: Partial<SpouseSubmission>,
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const { permitType } = submission;

  if (permitType === 'citizen') {
    score += 25;
    strengths.push('Sponsor is a Canadian citizen');
  } else if (permitType === 'permanent_resident' || permitType === 'pr') {
    score += 20;
    strengths.push('Sponsor is a Permanent Resident');
  } else if (permitType === 'work_permit') {
    score += 15;
    strengths.push('Sponsor has a valid work permit');
  } else if (permitType === 'study_permit' || permitType === 'student') {
    score += 10;
    strengths.push('Sponsor has a study permit');
    recommendations.push('Consider waiting until sponsor obtains PR status for stronger application');
  }

  return score;
}

function calculateFundsScore(
  submission: Partial<SpouseSubmission>,
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const { canadaFunds, indiaFunds } = submission;

  if (canadaFunds === '30k_plus' || canadaFunds === 'above_50000') {
    score += 15;
    strengths.push('Strong funds in Canada ($30K+)');
  } else if (canadaFunds === '15k_30k' || canadaFunds === '35000_50000') {
    score += 12;
    strengths.push('Good funds in Canada ($15K-$30K)');
  } else if (canadaFunds === '5k_15k' || canadaFunds === '25000_35000') {
    score += 8;
    strengths.push('Moderate funds in Canada ($5K-$15K)');
  } else if (canadaFunds === 'less_than_5k' || canadaFunds === 'below_25000') {
    score += 4;
    weaknesses.push('Limited funds in Canada');
    recommendations.push('Consider building more savings or include additional financial support');
  }

  if (indiaFunds === '2cr_plus' || indiaFunds === 'above_30_lakh') {
    score += 10;
    strengths.push('Strong funds in India (2 Crore+)');
  } else if (indiaFunds === '1cr_2cr' || indiaFunds === '20_30_lakh') {
    score += 8;
    strengths.push('Good funds in India (1-2 Crore)');
  } else if (indiaFunds === '50l_1cr' || indiaFunds === '10_20_lakh') {
    score += 5;
    strengths.push('Moderate funds in India (50L-1Cr)');
  } else if (indiaFunds === 'less_than_50l' || indiaFunds === 'below_10_lakh') {
    score += 2;
    weaknesses.push('Limited funds in India');
  }

  return score;
}

function calculateDurationScore(
  submission: Partial<SpouseSubmission> & { durationInCanada?: string },
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const durationValue = submission.durationInformation || submission.durationInCanada;
  const { marriageDuration } = submission;

  if (durationValue === '3_plus_years' || durationValue === 'more_than_5_years' || durationValue === '3_5_years') {
    score += 15;
    strengths.push('Sponsor well-established in Canada (3+ years)');
  } else if (durationValue === '2_3_years') {
    score += 12;
    strengths.push('Sponsor established in Canada (2-3 years)');
  } else if (durationValue === '1_2_years' || durationValue === '1_3_years') {
    score += 8;
    strengths.push('Sponsor has been in Canada 1-2 years');
  } else if (durationValue === 'less_than_1_year') {
    score += 3;
    weaknesses.push('Sponsor is relatively new to Canada');
    recommendations.push('Provide detailed plans showing intent to stay in Canada');
  }

  if (marriageDuration === '3_plus_years' || marriageDuration === 'more_than_3_years') {
    score += 15;
    strengths.push('Long-term marriage (3+ years)');
  } else if (marriageDuration === '2_3_years') {
    score += 12;
    strengths.push('Established marriage (2-3 years)');
  } else if (marriageDuration === '1_2_years') {
    score += 8;
    strengths.push('Marriage of 1-2 years');
  } else if (marriageDuration === 'less_than_1_year') {
    score += 3;
    weaknesses.push('Short marriage duration may require additional evidence');
    recommendations.push('Prepare comprehensive communication history and meeting records');
  }

  return score;
}

function calculateNocScore(
  submission: Partial<SpouseSubmission>,
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const { nocLevel } = submission;

  if (nocLevel === 'noc_0') {
    score += 15;
    strengths.push('High-skilled occupation (NOC 0 - Management)');
  } else if (nocLevel === 'noc_1' || nocLevel === 'noc_a') {
    score += 12;
    strengths.push('Professional occupation (NOC 1)');
  } else if (nocLevel === 'noc_2' || nocLevel === 'noc_b') {
    score += 10;
    strengths.push('Technical occupation (NOC 2)');
  } else if (nocLevel === 'noc_3' || nocLevel === 'noc_c') {
    score += 8;
    strengths.push('Skilled occupation (NOC 3)');
  } else if (nocLevel === 'noc_4' || nocLevel === 'noc_d') {
    score += 5;
    strengths.push('Intermediate occupation (NOC 4)');
  } else if (nocLevel === 'noc_5') {
    score += 3;
    weaknesses.push('Entry-level occupation may affect scoring');
  }

  return score;
}

function calculateCreditsScore(
  submission: Partial<SpouseSubmission>,
  strengths: string[],
  weaknesses: string[],
  recommendations: string[]
): number {
  let score = 0;
  const { credits } = submission;

  if (credits === '9_plus') {
    score += 10;
    strengths.push('Full-time student status (9+ credits)');
  } else if (credits === 'less_than_9') {
    score += 5;
    weaknesses.push('Part-time student status (less than 9 credits)');
    recommendations.push('Consider increasing course load to maintain full-time status');
  }

  return score;
}

function generateSuggestion(score: number, category: string): string {
  if (category === 'high') {
    return `Excellent! You have high spouse visa approval chances. Your application appears well-prepared with strong documentation.`;
  } else if (category === 'moderate') {
    return 'Good! You have moderate approval chances. Consider addressing the areas mentioned to strengthen your application further.';
  } else {
    return 'Your profile needs improvement before applying. Focus on strengthening weak areas first. Our counselors can provide personalized guidance.';
  }
}
