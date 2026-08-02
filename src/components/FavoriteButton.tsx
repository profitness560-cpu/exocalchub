import { track } from '../utils/analytics'
import './FavoriteButton.css'
export function FavoriteButton({ active, onClick }: { active: boolean; onClick: () => void }) { return <button className="favorite-button" type="button" aria-pressed={active} aria-label={active ? 'Remove from favorites' : 'Add to favorites'} title={active ? 'Remove from favorites' : 'Add to favorites'} onClick={() => { onClick(); track('favorite') }}>{active ? '★' : '☆'}</button> }
