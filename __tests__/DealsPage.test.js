import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../app/page'

// Mock the fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
    })
)

// Mock the price service
jest.mock('../app/live/priceService', () => ({
    getSolPriceUsd: jest.fn(() => Promise.resolve(20)),
}))

// Mock child components to avoid complex rendering in unit test
jest.mock('../app/components/ListingGrid', () => {
    return function MockListingGrid() {
        return <div data-testid="listing-grid">Listing Grid</div>
    }
})

jest.mock('../app/components/Header', () => {
    return function MockHeader() {
        return <div data-testid="header">Header</div>
    }
})

jest.mock('../app/components/Sidebar', () => {
    return function MockSidebar() {
        return <div data-testid="sidebar">Sidebar</div>
    }
})

jest.mock('../app/components/Footer', () => {
    return function MockFooter() {
        return <div data-testid="footer">Footer</div>
    }
})

describe('Deals Page', () => {
    it('renders the search input', () => {
        render(<Home />)
        const searchInput = screen.getByPlaceholderText('Search cards...')
        expect(searchInput).toBeInTheDocument()
    })

    it('renders the filter buttons', () => {
        render(<Home />)
        expect(screen.getByText('All')).toBeInTheDocument()
        expect(screen.getByText('Gold')).toBeInTheDocument()
        expect(screen.getByText('Red')).toBeInTheDocument()
        expect(screen.getByText('Blue')).toBeInTheDocument()
    })

    it('renders the sort dropdown', () => {
        render(<Home />)
        const sortSelect = screen.getByRole('combobox')
        expect(sortSelect).toBeInTheDocument()
        expect(screen.getByText('Newest Listed')).toBeInTheDocument()
    })

    it('updates search query on input', () => {
        render(<Home />)
        const searchInput = screen.getByPlaceholderText('Search cards...')
        fireEvent.change(searchInput, { target: { value: 'Charizard' } })
        expect(searchInput.value).toBe('Charizard')
    })
})
