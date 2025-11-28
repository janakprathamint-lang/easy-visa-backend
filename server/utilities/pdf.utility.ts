// import React from "react";
// import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
// import type { Submission } from "@shared/schema";

// export const pdfStyles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontFamily: 'Helvetica',
//   },
//   header: {
//     marginBottom: 30,
//     textAlign: 'center',
//     borderBottom: '2 solid #dc2626',
//     paddingBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#dc2626',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#4b5563',
//   },
//   section: {
//     marginBottom: 25,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 12,
//     borderBottom: '1 solid #e5e7eb',
//     paddingBottom: 6,
//   },
//   text: {
//     fontSize: 12,
//     color: '#374151',
//     marginBottom: 6,
//     lineHeight: 1.5,
//   },
//   scoreText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#059669',
//     marginBottom: 10,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 30,
//     left: 40,
//     right: 40,
//     textAlign: 'center',
//     borderTop: '1 solid #e5e7eb',
//     paddingTop: 15,
//   },
//   footerText: {
//     fontSize: 10,
//     color: '#6b7280',
//   },
// });

// export async function generateSubmissionPDF(submission: Submission): Promise<Buffer> {
//   const pdfDoc = React.createElement(
//     Document,
//     null,
//     React.createElement(
//       Page,
//       { size: "A4", style: pdfStyles.page },
//       React.createElement(
//         View,
//         { style: pdfStyles.header },
//         React.createElement(Text, { style: pdfStyles.title }, "Canada Study Visa"),
//         React.createElement(Text, { style: pdfStyles.subtitle }, "Eligibility Report")
//       ),
//       React.createElement(
//         View,
//         { style: pdfStyles.section },
//         React.createElement(Text, { style: pdfStyles.sectionTitle }, "Personal Information"),
//         React.createElement(Text, { style: pdfStyles.text }, `Name: ${submission.fullName}`),
//         React.createElement(Text, { style: pdfStyles.text }, `Email: ${submission.email}`),
//         React.createElement(Text, { style: pdfStyles.text }, `Phone: ${submission.phone}`),
//         React.createElement(Text, { style: pdfStyles.text }, `City: ${submission.city}`)
//       ),
//       React.createElement(
//         View,
//         { style: pdfStyles.section },
//         React.createElement(Text, { style: pdfStyles.sectionTitle }, "Eligibility Assessment"),
//         React.createElement(Text, { style: pdfStyles.scoreText }, `Probability Score: ${submission.eligibilityScore}%`),
//         React.createElement(
//           Text,
//           { style: pdfStyles.text },
//           `Status: ${submission.eligibilityScore && submission.eligibilityScore >= 70 ? "Eligible" : "Not Eligible"}`
//         )
//       ),
//       React.createElement(
//         View,
//         { style: pdfStyles.section },
//         React.createElement(Text, { style: pdfStyles.sectionTitle }, "Recommendation"),
//         React.createElement(
//           Text,
//           { style: pdfStyles.text },
//           submission.eligibilityScore && submission.eligibilityScore >= 80
//             ? "You have a strong profile for Canada study visa. Consider improving your writing score to increase chances further."
//             : "You have a good profile for Canada study visa. We recommend improving your language test scores."
//         )
//       ),
//       React.createElement(
//         View,
//         { style: pdfStyles.footer },
//         React.createElement(Text, { style: pdfStyles.footerText }, `Generated on ${new Date().toLocaleDateString()}`)
//       )
//     )
//   );
  
//   return await pdf(pdfDoc).toBuffer();
// }
