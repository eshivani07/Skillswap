// Lightweight scoring function that stands in for the AI Matchmaking Model
// described in the architecture (skill / level / schedule scoring).
// Score = how well another user's "teaches" list covers what I want to learn,
// plus a bonus if they in turn want something I can teach (mutual swap).
export function scoreMatch(me, other) {
  if (!me || !other) return 0

  const iWantToLearn = new Set(me.learns.map((s) => s.toLowerCase()))
  const theyCanTeach = new Set(other.teaches.map((s) => s.toLowerCase()))
  const theyWantToLearn = new Set(other.learns.map((s) => s.toLowerCase()))
  const iCanTeach = new Set(me.teaches.map((s) => s.toLowerCase()))

  let score = 0
  const matchedSkills = []

  theyCanTeach.forEach((skill) => {
    if (iWantToLearn.has(skill)) {
      score += 40
      matchedSkills.push(skill)
    }
  })

  let mutual = false
  theyWantToLearn.forEach((skill) => {
    if (iCanTeach.has(skill)) {
      score += 25
      mutual = true
    }
  })

  // Small boost for highly rated / experienced mentors
  score += Math.min(other.rating * 3, 15)

  return { score: Math.round(score), matchedSkills, mutual }
}

export function rankMatches(me, candidates) {
  return candidates
    .map((c) => ({ user: c, ...scoreMatch(me, c) }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
}
