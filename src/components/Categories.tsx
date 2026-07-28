import type { Category } from '../data/categories'
import './Categories.css'

interface CategoriesProps {
  categories: Category[]
}

export function Categories({ categories }: CategoriesProps) {
  return (
    <section className="categories" id="categories">
      <div className="categories__header">
        <h2 className="categories__title">Browse by category</h2>
        <p className="categories__subtitle">
          Explore calculators organized by topic
        </p>
      </div>
      <div className="categories__grid">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#category-${category.id}`}
            className="category-card"
          >
            <span className="category-card__icon" aria-hidden="true">
              {category.icon}
            </span>
            <h3 className="category-card__name">{category.name}</h3>
            <p className="category-card__description">{category.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
