import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

// Register font
Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontSize: 10,
          lineHeight: 1.2,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          padding: '20px 15px',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
        },
        logo: {
          width: 40,
          height: 40,
          borderRadius: 5,
        },
        title: {
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#333',
          marginBottom: 5,
        },
        section: {
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#F7F7F7',
          borderRadius: 5,
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
          flexDirection: 'column',
        },
        category: {
          fontSize: 14,
          fontWeight: 'bold',
          marginBottom: 10,
          color: '#555',
        },
        question: {
          fontSize: 12,
          marginBottom: 3,
        },
        rating: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'bold',
        },
        comments: {
          fontSize: 12,
          color: '#555',
          fontWeight: 'bold',
        },
        table: {
          display: 'flex',
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: 10,
        },
        tableHeader: {
          backgroundColor: '#E0E0E0',
          borderBottom: '1px solid #BDBDBD',
        },
        tableRow: {
          flexDirection: 'row',
          borderBottom: '1px solid #BDBDBD',
        },
        tableCell: {
          width: '800px', // Set a fixed width for the question column
          padding: 5,
          textAlign: 'left',
          borderRight: '1px solid #BDBDBD',
        },
        tableCellLast: {
          width: '30%', // Set a fixed width for the rating column
          padding: 5,
          textAlign: 'left',
        },
        footer: {
          marginTop: 20,
          paddingTop: 10,
          borderTop: '1px solid #BDBDBD',
          paddingBottom: 20,
        },
      }),
    []
  );

const combineQuestionAndRatings = (questions, ratings) => {
  if (!ratings || !ratings.length) return {};

  const ratingMap = ratings.reduce((map, { performanceFeedbackQuestionId, rating }) => {
    map[performanceFeedbackQuestionId] = rating;
    return map;
  }, {});

  return questions.reduce((acc, question) => {
    const { categoryId, categoryName, questionText, performanceFeedbackQuestionId } = question;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: categoryName,
        questions: [],
      };
    }
    acc[categoryId].questions.push({
      text: questionText,
      rating: ratingMap[performanceFeedbackQuestionId] || 'N/A',
    });
    return acc;
  }, {});
};

export default function EmployeeEvaluationPDF({ questionData, Employeedata }) {
  const combinedData = combineQuestionAndRatings(questionData, Employeedata.questionRatings);

  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image source="/logo/logo_single.png" style={styles.logo} />
          <Text style={styles.title}>Employee Evaluation Report</Text>
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.category}>Employee Information</Text>
              <Text style={styles.question}>Name: {Employeedata.employeeName}</Text>
              <Text style={styles.question}>Employee Code: {Employeedata.employeeCode}</Text>
              <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 16 }}>
                Evaluation Date: {Employeedata.dateOfEvaluation}
              </Text>
            </View>
            <View>
              <Text style={styles.category}>Evaluator Information</Text>
              <Text style={styles.question}>Evaluator Name: {Employeedata.reviewerName}</Text>
              <Text style={styles.question}>Evaluator Code: {Employeedata.reviewerCode}</Text>
            </View>
          </View>
        </View>

        {Object.keys(combinedData).map((categoryId) => {
          const category = combinedData[categoryId];
          return (
            <View style={styles.section} key={categoryId}>
              <Text style={styles.category}>{category.name}</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View
                    style={{
                      width: '3000px',
                      padding: 5, // Set a fixed width for the question column
                    }}
                  >
                    <Text style={styles.question}>Question</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.rating}>Rating</Text>
                  </View>
                </View>
                {category.questions.map((question, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View
                      style={{
                        width: '3000px', // Set a fixed width for the question column
                        padding: 5,
                        textAlign: 'left',
                        borderRight: '1px solid #BDBDBD',
                      }}
                    >
                      <Text style={styles.question}>{question.text}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.rating}>{question.rating}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={styles.category}>Overall Rating</Text>
            <Text style={styles.rating}>{Employeedata.finalScore}/100</Text>
          </View>
          <View style={{ backgroundColor: '#F7F7F7', padding: 10, borderRadius: 5 }}>
            <Text style={styles.comments}>Overall Comments:</Text>
            <Text style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
              {Employeedata.finalComment}
            </Text>
          </View>

          <View
            style={{
              marginTop: 20,
              border: 'solid',
              borderWidth: '1px',
              borderColor: 'black',
              padding: 3,
            }}
          >
            <Text style={styles.category}>Rating Criteria:</Text>
            <View>
              <Text style={styles.question}>1 - Poor</Text>
              <Text style={styles.question}>2 - Fair</Text>
              <Text style={styles.question}>3 - Good</Text>
              <Text style={styles.question}>4 - Very Good</Text>
              <Text style={styles.question}>5 - Excellent</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
