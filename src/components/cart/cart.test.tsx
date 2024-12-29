import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Cart from './cart'
import { UsersCart } from '@/payload-types'

jest.mock('@/hooks/cart', () => ({
    useAddItem: () => ({ mutate: jest.fn() }),
    useRemoveItem: () => ({ mutate: jest.fn() }),
}))

const mockCart: UsersCart = {
    items: [
        {
            id: '1',
            product: {
                id: 1,
                slug: 'product-1',
                title: 'Product 1',
                description: 'Description of Product 1',
                price: 20,
                variantInventory: [
                    { id: 'variant1', size: 'M', color: 'Red', price: 20 },
                ],
                inventoryQuantity: 100,
                category: 1,
                images: [1],
                updatedAt: '2023-01-01T00:00:00Z',
                createdAt: '2023-01-01T00:00:00Z',
            },
            variantId: 'variant1',
            quantity: 2,
        },
    ],
    total: 40,
    id: 0,
    user: 0,
    updatedAt: '',
    createdAt: ''
}

describe('Cart Component', () => {
    it('renders correctly when open', () => {
        render(<Cart />)
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument()
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('M / Red')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('$40.00')).toBeInTheDocument()
    })

    it('renders empty cart message when there are no items', () => {
        render(<Cart />)
        
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    })

    it('calls onAddItem when add button is clicked', () => {
        const { useAddItem } = require('@/hooks/cart')
        const addItemMock = useAddItem().mutate
        render(<Cart />)
        
        fireEvent.click(screen.getByText('+'))
        expect(addItemMock).toHaveBeenCalledWith({ selectedVariantId: 'variant1', product: mockCart.items?.[0]?.product })
    })

    it('calls onRemoveItem when remove button is clicked', () => {
        const { useRemoveItem } = require('@/hooks/cart')
        const removeItemMock = useRemoveItem().mutate
        render(<Cart />)
        
        fireEvent.click(screen.getByText('-'))
        expect(removeItemMock).toHaveBeenCalledWith({ itemId: '1', removeCompletely: false })
    })
})