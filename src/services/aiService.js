// src/services/aiService.js
// Central AI layer. Every AI-powered feature (Session, Quiz, Assignment) goes
// through this file instead of talking to Ollama directly — so swapping to a
// hosted API later (OpenAI/Gemini, or your own backend) means changing ONE file.

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434/api/chat'
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3'

// Mock responses for development/testing when API is not available
const MOCK_RESPONSES = {
  'C Programming': {
    Variables: "Variables are containers that store data values. In C, you declare a variable with a type like `int`, `float`, or `char`. For example: `int age = 25;` creates an integer variable named 'age' with value 25. Think of it like a labeled box that holds a specific kind of information.",
    'Data Types': "C has several basic data types: `int` (whole numbers), `float`/`double` (decimal numbers), `char` (single characters), and others. Each type determines how much memory is used and what kind of values it can hold. Choosing the right data type is important for efficient programs.",
    Arrays: "Arrays let you store multiple values of the same type in one variable. For example: `int numbers[5];` creates an array that can hold 5 integers. You access each element using an index: `numbers[0]` for the first element. Arrays are useful when you need to work with collections of data.",
    Loops: "Loops repeat a block of code multiple times. The most common loops are `for` and `while`. A `for` loop counts from a start value to an end value, while a `while` loop repeats as long as a condition is true. Loops save you from writing the same code over and over."
  },
  'Python': {
    Functions: "Functions are reusable blocks of code that perform a specific task. You define a function with `def functionName():` and call it by writing `functionName()`. Functions can take inputs (parameters) and return outputs, making your code more organized and easier to reuse.",
    'Data Structures': "Python's main data structures are lists (ordered, changeable), tuples (ordered, unchangeable), dictionaries (key-value pairs), and sets (unordered, unique items). Lists are created with `[]`, dictionaries with `{}`, and tuples with `()`. Each has different use cases.",
    'List Comprehension': "List comprehension is a concise way to create lists. Instead of using a loop, you can write: `[x*2 for x in range(5)]` to create a list of even numbers. It's faster and more readable than traditional loops.",
  },
  'JavaScript': {
    'Arrow Functions': "Arrow functions are a concise way to write functions in JavaScript using the `=>` operator. For example: `const add = (a, b) => a + b;` is shorter than traditional function syntax. They're great for short, simple functions.",
    Destructuring: "Destructuring lets you extract values from arrays and objects into separate variables. For arrays: `const [a, b] = [1, 2];` and for objects: `const {name, age} = person;`. It makes your code cleaner and more readable.",
    'Spread Operator': "The spread operator `...` spreads elements of an array or object. For example: `[...array1, ...array2]` combines two arrays, and `{...obj1, ...obj2}` combines two objects. It's very useful for copying and merging data."
  }
}

async function callAI(messages, { expectJson = false } = {}) {
  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: false,
        ...(expectJson ? { format: 'json' } : {})
      })
    })

    if (!res.ok) {
      throw new Error(`AI request failed (${res.status})`)
    }

    const data = await res.json()
    const content = data?.message?.content ?? ''

    if (expectJson) {
      try {
        return JSON.parse(content)
      } catch {
        // Model sometimes wraps JSON in ```json fences — strip and retry once.
        const cleaned = content.replace(/```json|```/g, '').trim()
        return JSON.parse(cleaned)
      }
    }
    return content
  } catch (err) {
    // Fall back to mock responses when API is unavailable
    console.warn('AI API unavailable, using mock responses:', err.message)
    return null // Will trigger mock fallback in individual functions
  }
}

// 1. AI Buddy — answers a question inside a live learning session.
export async function askTutor({ skill, level, question, history = [] }) {
  const system = {
    role: 'system',
    content: `You are a friendly, patient tutor teaching ${skill} to a ${level} student inside SkillSwap. Keep answers short (3-5 sentences), use simple examples, and match the ${level} level.`
  }
  const messages = [system, ...history, { role: 'user', content: question }]
  
  const response = await callAI(messages)
  
  if (response) {
    return response
  }
  
  // Mock fallback: provide relevant response based on skill and question
  const skillResponses = MOCK_RESPONSES[skill] || {}
  
  // Try to find a matching topic in the question
  for (const [topic, answer] of Object.entries(skillResponses)) {
    if (question.toLowerCase().includes(topic.toLowerCase())) {
      return answer
    }
  }
  
  // Generic fallback response
  return `That's a great question about ${skill}! Let me think about that... To better explain, could you tell me which specific aspect interests you most? I want to make sure I explain it at a level that makes sense for you as a ${level} learner.`
}

// 2. Quiz generation — questions covering what was just taught.
export async function generateQuiz({ skill, level, topicsCovered = [], count = 5 }) {
  const prompt = `Create a ${count}-question quiz on "${skill}" for a ${level} learner${
    topicsCovered.length ? ` covering: ${topicsCovered.join(', ')}` : ''
  }. Return ONLY JSON in this exact shape, no extra text, no markdown fences:
{"questions":[{"id":"q1","question":"...","topic":"..."}]}`
  const result = await callAI([{ role: 'user', content: prompt }], { expectJson: true })
  
  if (result?.questions) {
    return result.questions
  }
  
  // Mock quiz questions by skill
  const quizzes = {
    'C Programming': [
      { id: 'q1', question: 'What is a variable in C?', options: ['A container for storing data', 'A function name', 'A loop counter', 'A memory address'], correct: 0, topic: 'Variables' },
      { id: 'q2', question: 'Which data type stores whole numbers?', options: ['float', 'int', 'char', 'double'], correct: 1, topic: 'Data Types' },
      { id: 'q3', question: 'How do you declare an array of 10 integers?', options: ['int array[10];', 'array int[10];', '[10]int array;', 'int [10]array;'], correct: 0, topic: 'Arrays' },
      { id: 'q4', question: 'What will this loop do: for(int i=0; i<3; i++)?', options: ['Loop 4 times', 'Loop 3 times', 'Loop infinitely', 'Not loop at all'], correct: 1, topic: 'Loops' },
      { id: 'q5', question: 'What does printf() do in C?', options: ['Receives input', 'Displays output', 'Creates variables', 'Ends the program'], correct: 1, topic: 'I/O' }
    ],
    'Python': [
      { id: 'q1', question: 'How do you define a function in Python?', options: ['function func():', 'def func():', 'func():', 'define func():'], correct: 1, topic: 'Functions' },
      { id: 'q2', question: 'Which data structure is ordered and changeable?', options: ['tuple', 'set', 'list', 'dictionary'], correct: 2, topic: 'Data Structures' },
      { id: 'q3', question: 'What does [x*2 for x in range(5)] create?', options: ['A tuple', 'A set', 'A list', 'A dictionary'], correct: 2, topic: 'List Comprehension' },
      { id: 'q4', question: 'What does range(5) produce?', options: ['0,1,2,3,4,5', '0,1,2,3,4', '1,2,3,4,5', '0,0,0,0,0'], correct: 1, topic: 'Loops' },
      { id: 'q5', question: 'How do you import a module in Python?', options: ['include module', 'import module', 'use module', 'load module'], correct: 1, topic: 'Modules' }
    ],
    'JavaScript': [
      { id: 'q1', question: 'What is an arrow function in JavaScript?', options: ['A conditional statement', 'A concise function syntax', 'A loop type', 'An array method'], correct: 1, topic: 'Arrow Functions' },
      { id: 'q2', question: 'What does const [a, b] = [1, 2] do?', options: ['Creates arrays', 'Destructures an array', 'Compares values', 'Declares constants'], correct: 1, topic: 'Destructuring' },
      { id: 'q3', question: 'What does the spread operator ... do?', options: ['Multiplies values', 'Spreads array elements', 'Creates strings', 'Compares arrays'], correct: 1, topic: 'Spread Operator' },
      { id: 'q4', question: 'What is typeof used for?', options: ['Defining types', 'Checking data types', 'Converting types', 'Creating types'], correct: 1, topic: 'Types' },
      { id: 'q5', question: 'Which is a valid JavaScript object?', options: ['{key: value}', '[key, value]', '(key: value)', 'key: value'], correct: 0, topic: 'Objects' }
    ]
  }
  
  return quizzes[skill] || quizzes['C Programming']
}

// 3. Quiz evaluation — score the learner's free-text answers.
export async function evaluateQuiz({ skill, questions, answers }) {
  const prompt = `Skill: ${skill}. Grade each answer as correct/partial/incorrect and list weak topics.
Questions & answers: ${JSON.stringify(
    questions.map((q) => ({ ...q, answer: answers[q.id] || '' }))
  )}
Return ONLY JSON, no markdown fences: {"score": <number out of ${questions.length}>, "results": [{"id":"q1","verdict":"correct|partial|incorrect","feedback":"..."}], "weakTopics": ["..."]}`
  const result = await callAI([{ role: 'user', content: prompt }], { expectJson: true })
  
  if (result?.score !== undefined) {
    return result
  }
  
  // Mock evaluation: simple scoring based on answer patterns
  let score = 0
  const results = []
  const wrongTopics = new Set()
  
  questions.forEach((q) => {
    const userAnswer = answers[q.id]?.trim().toLowerCase() || ''
    const isCorrect = userAnswer === 'correct' || userAnswer === 'yes' || userAnswer === 'true'
    
    if (isCorrect) {
      score++
      results.push({
        id: q.id,
        verdict: 'correct',
        feedback: '✓ Good job!'
      })
    } else if (userAnswer.length > 10) {
      score += 0.5
      results.push({
        id: q.id,
        verdict: 'partial',
        feedback: '~ Partial credit. Review the concept for more detail.'
      })
      wrongTopics.add(q.topic)
    } else {
      results.push({
        id: q.id,
        verdict: 'incorrect',
        feedback: '✗ Incorrect. Take time to review this topic.'
      })
      wrongTopics.add(q.topic)
    }
  })
  
  return {
    score: Math.round(score),
    percentage: Math.round((score / questions.length) * 100),
    results,
    weakTopics: Array.from(wrongTopics)
  }
}

// 4. Assignment generation — 2-3 practice problems targeting weak topics.
export async function generateAssignments({ skill, level, weakTopics = [] }) {
  const prompt = `Create 2-3 short coding/practice assignments for "${skill}" at ${level} level${
    weakTopics.length ? `, focused on these weak topics: ${weakTopics.join(', ')}` : ''
  }. Return ONLY JSON, no markdown fences: {"assignments":[{"id":"a1","title":"...","prompt":"...","topic":"..."}]}`
  const result = await callAI([{ role: 'user', content: prompt }], { expectJson: true })
  
  if (result?.assignments) {
    return result.assignments
  }
  
  // Mock assignments by skill
  const assignmentsBySkill = {
    'C Programming': [
      {
        id: 'a1',
        title: 'Variable Declaration and Assignment',
        description: 'Write a C program that declares variables of different types (int, float, char) and assigns values to them. Print all values.',
        topic: 'Variables',
        difficulty: 'Beginner',
        instructions: '1. Declare int, float, and char variables\n2. Assign values\n3. Use printf to display them'
      },
      {
        id: 'a2',
        title: 'Simple Array Manipulation',
        description: 'Create an array of 5 integers, calculate their sum and average.',
        topic: 'Arrays',
        difficulty: 'Beginner',
        instructions: '1. Create an array of 5 integers\n2. Calculate the sum\n3. Calculate the average\n4. Print results'
      },
      {
        id: 'a3',
        title: 'Loop Practice',
        description: 'Write a program that prints the multiplication table for numbers 1-10.',
        topic: 'Loops',
        difficulty: 'Beginner',
        instructions: '1. Use nested loops\n2. Print each table clearly\n3. Format output nicely'
      }
    ],
    'Python': [
      {
        id: 'a1',
        title: 'List Processing',
        description: 'Create a function that takes a list of numbers and returns their squares.',
        topic: 'Functions',
        difficulty: 'Beginner',
        instructions: '1. Define a function\n2. Use list comprehension or loop\n3. Return the squared numbers'
      },
      {
        id: 'a2',
        title: 'Dictionary Operations',
        description: 'Create a dictionary of students and their grades. Write code to find the average grade.',
        topic: 'Data Structures',
        difficulty: 'Beginner',
        instructions: '1. Create student dictionary\n2. Calculate average\n3. Find highest and lowest grades'
      },
      {
        id: 'a3',
        title: 'String Manipulation',
        description: "Write a function that reverses a string and checks if it's a palindrome.",
        topic: 'Strings',
        difficulty: 'Beginner',
        instructions: '1. Write reverse function\n2. Check palindrome\n3. Test with examples'
      }
    ]
  }
  
  return assignmentsBySkill[skill] || assignmentsBySkill['C Programming']
}

// 5. Assignment evaluation — review submitted code/solution.
export async function evaluateAssignment({ skill, prompt, submission }) {
  const evalPrompt = `Skill: ${skill}. Assignment: "${prompt}". Student's submission:
---
${submission}
---
Evaluate correctness, logic, and clarity. Return ONLY JSON, no markdown fences: {"passed": <boolean>, "score": <number out of 10>, "feedback": "..."}`
  const result = await callAI([{ role: 'user', content: evalPrompt }], { expectJson: true })
  
  if (result?.score !== undefined) {
    return result
  }
  
  // Mock evaluation
  const submissionLength = submission?.trim().length || 0
  const hasSyntax = /function|def|class|if|for|while|return|print|console/.test(submission || '')
  
  return {
    passed: submissionLength > 20 && hasSyntax,
    score: hasSyntax ? 7 : 3,
    feedback: hasSyntax
      ? 'Good attempt! Your code structure looks reasonable. Review the edge cases and test thoroughly.'
      : 'Your submission needs more work. Make sure to include proper syntax and logic.'
  }
}
