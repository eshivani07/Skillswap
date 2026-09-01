// src/services/assignmentService.js
import { generateAssignments, evaluateAssignment } from './aiService.js'

export async function createAssignments({ skill, level, weakTopics }) {
  return generateAssignments({ skill, level, weakTopics })
}

export async function submitAssignment({ skill, prompt, submission }) {
  return evaluateAssignment({ skill, prompt, submission })
}
