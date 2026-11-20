import { Link } from 'react-router-dom'
import { calculatorMap } from '../data/calculators'
import './RelatedCalculators.css'

/** Internal links to related tools. Used by the dedicated calculator pages
 *  (BMI, Mortgage, Scientific); the generic CalculatorPage renders its own
 *  related list. Only ids that resolve to a real calculator are shown. */
export function RelatedCalculators({ ids }: { ids: readonly string[] }) {
  const related = ids
    .map((id) => calculatorMap.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  if (related.length === 0) return null
  return (
    <section className="related-calculators" aria-labelledby="related-calculators-title">
      <h2 id="related-calculators-title">Related calculators</h2>
      <ul className="related-calculators__list">
        {related.map((item) => (
          <li key={item.id}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
