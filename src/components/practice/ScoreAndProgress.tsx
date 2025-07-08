"use client";

import React, { useState } from "react";
import { Question, QuestionHistory } from '@/hooks/usePracticeSession';

interface ScoreAndProgressProps {
  correctCount: number;
  wrongCount: number;
  currentStreak: number;
  maxStreak: number;
  predictedScore: number;
  questionHistory: QuestionHistory[];
  onProgressBoxClick: (index: number) => void;
  currentQuestion: Question | null;
}

const ScoreAndProgress: React.FC<ScoreAndProgressProps> = ({
  correctCount,
  wrongCount,
  currentStreak,
  maxStreak,
  predictedScore,
  questionHistory,
  onProgressBoxClick,
  currentQuestion,
}) => {
  const [isAccuracyExpanded, setIsAccuracyExpanded] = useState(false);
  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts === 0 ? 0 : (correctCount / totalAttempts) * 100;

  return (
    <div style={{ width: "250px", display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
      {/* Predicted Score */}
      <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff", paddingTop: "10px", paddingBottom: "12px", textAlign: "left", paddingLeft: "15px", margin: "0px" }}>
          <i className="fas fa-star" style={{ marginRight: "8px" }}></i>Predicted Score
        </div>
        <div style={{ fontSize: "48px", fontWeight: "bold", color: "#292F33", textAlign: "center", padding: '10px 0' }}>
          {totalAttempts === 0 ? <span style={{ color: '#9e9e9e' }}> ---</span> : <span style={{ color: '#4285f4' }}> {predictedScore}</span>}
        </div>
      </div>

      {/* Accuracy */}
      <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
        <div 
          onClick={() => setIsAccuracyExpanded(!isAccuracyExpanded)}
          style={{ 
            fontSize: "16px", 
            fontWeight: "bold", 
            color: "#292F33", 
            background: "#99c6ff", 
            paddingTop: "10px", 
            paddingBottom: "12px", 
            textAlign: "left", 
            paddingLeft: "15px", 
            margin: "0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "15px",
            cursor: "pointer"
          }}
        >
          <span>
            <i className="fas fa-bullseye" style={{ marginRight: "8px" }}></i>Accuracy
          </span>
          <i className={`fas fa-chevron-${isAccuracyExpanded ? 'up' : 'down'}`} />
        </div>
        <div style={{ color: "black", padding: "15px" }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', color: '#4285f4' }}>
            {accuracy.toFixed(1)}%
          </div>
          {isAccuracyExpanded && (
            <>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span><i className="far fa-check-circle" style={{ marginRight: "8px", color: "#4caf50" }}></i>Correct: <strong>{correctCount}</strong></span>
                <span><i className="far fa-times-circle" style={{ marginRight: "8px", color: "#f66055" }}></i>Incorrect: <strong>{wrongCount}</strong></span>
                <span><i className="fas fa-fire" style={{ marginRight: "8px", color: "#ff9800" }}></i>Streak: <strong>{currentStreak}</strong></span>
                <span><i className="fas fa-trophy" style={{ marginRight: "8px", color: "#3f51b5" }}></i>Max Streak: <strong>{maxStreak}</strong></span>
              </div>

              <div style={{
                height: "17px", backgroundColor: totalAttempts === 0 ? "#e0e0e0" : "#f66055",
                borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}>
                <div style={{ width: `${accuracy.toFixed(2)}%`, height: "100%", backgroundColor: "#4caf50", transition: "width 0.3s ease" }} />
              </div>
              <div style={{ fontSize: '13px', marginTop: '10px', textAlign: 'center', color: 'black' }}>
                Questions Answered: <strong>{totalAttempts}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress */}
      <div style={{ backgroundColor: "#eff6ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#292F33", background: "#99c6ff", paddingTop: "10px", paddingBottom: "12px", textAlign: "left", paddingLeft: "15px", margin: "0px" }}>
          <i className="fas fa-tasks" style={{ marginRight: "8px" }}></i>Progress
        </div>
        <div style={{
          padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px', color: 'white',
          maxHeight: '125px', overflowY: 'auto'
        }}>
          {questionHistory.length === 0 && <span style={{ color: 'grey', fontSize: '14px' }}>Answer questions to see your progress.</span>}
          {questionHistory.map((item, index) => {
            let bgColor;
            if (item.isMarkedForLater) {
              bgColor = "#FFCC00"; 
            } else if (item.isAnswered) {
              bgColor = item.isCorrect ? "#4caf50" : "#f44336";
            } else {
              bgColor = "#9e9e9e"; 
            }

            const isCurrentQuestion = currentQuestion && item.question.id === currentQuestion.id;

            return (
              <button 
                key={item.id} 
                onClick={() => onProgressBoxClick(index)} 
                title={`Question ${index + 1}${item.isMarkedForLater ? ' (Marked for Review)' : ''}${item.isAnswered ? (item.isCorrect ? ' (Correct)' : ' (Incorrect)') : ''}`}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '6px',
                  backgroundColor: bgColor,
                  border: isCurrentQuestion ? '3px solid #0d47a1' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  flexShrink: 0,
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreAndProgress;