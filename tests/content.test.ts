import { describe, expect, it } from 'vitest'
import { calculators, calculatorMap } from '../src/data/calculators'

const words = (text: string) => text.split(/\s+/).filter(Boolean).length
const BANNED_QUESTIONS = ['Are the results exact?', 'How are results calculated?']

describe('calculator content (AdSense content improvements)', () => {
  it('covers all 29 calculators', () => {
    expect(calculators).toHaveLength(29)
  })

  for (const calculator of calculators) {
    it(`${calculator.id}: has an explanation, a worked example and calculator-specific FAQs`, () => {
      expect(words(calculator.explanation)).toBeGreaterThanOrEqual(80)
      // At least two paragraphs.
      expect(calculator.explanation).toContain('\n\n')
      expect(calculator.example.inputs.trim().length).toBeGreaterThan(0)
      expect(calculator.example.calculation.trim().length).toBeGreaterThan(0)
      expect(calculator.example.result.trim().length).toBeGreaterThan(0)
      expect(calculator.faq.length).toBeGreaterThanOrEqual(3)
      for (const [question, answer] of calculator.faq) {
        expect(question.trim().length).toBeGreaterThan(0)
        expect(words(answer)).toBeGreaterThanOrEqual(20)
        expect(BANNED_QUESTIONS).not.toContain(question)
      }
      // Supporting content: explanation + worked example + FAQ answers.
      const supporting =
        words(calculator.explanation) +
        words(calculator.example.inputs) +
        words(calculator.example.calculation) +
        words(calculator.example.result) +
        calculator.faq.reduce((sum, [, answer]) => sum + words(answer), 0)
      expect(supporting).toBeGreaterThanOrEqual(150)
    })
  }

  it('no FAQ question is repeated across calculators', () => {
    const questions = calculators.flatMap((calculator) => calculator.faq.map(([question]) => question))
    expect(new Set(questions).size).toBe(questions.length)
  })

  it('every related calculator exists', () => {
    for (const calculator of calculators) {
      expect(calculator.related.length).toBeGreaterThanOrEqual(1)
      for (const id of calculator.related) expect(calculatorMap.has(id)).toBe(true)
    }
  })

  it('health calculators state results are informational, not medical advice', () => {
    for (const calculator of calculators.filter((c) => c.category === 'health')) {
      expect(calculator.explanation).toMatch(/not a substitute for professional medical advice/i)
    }
  })
})
