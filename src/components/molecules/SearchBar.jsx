import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ onSearch, placeholder = "Search tasks...", className = '' }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
        />
      </div>
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="md"
          icon="X"
          onClick={handleClear}
        />
      )}
    </form>
  )
}

export default SearchBar