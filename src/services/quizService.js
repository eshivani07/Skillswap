// src/services/quizService.js
import { generateQuiz, evaluateQuiz } from './aiService.js'

export async function startQuiz({ skill, level, topicsCovered }) {
  return generateQuiz({ skill, level, topicsCovered })
}

export async function submitQuiz({ skill, questions, answers }) {
  return evaluateQuiz({ skill, questions, answers })
}
