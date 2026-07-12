import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const initialState = {
  items: [], // { id, name, price, currency, image, qty, kind: 'product' | 'part' }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + action.item.qty } : i
          ),
        }
      }
      return { items: [...state.items, action.item] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'UPDATE_QTY':
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const api = useMemo(() => {
    const addItem = (item, qty = 1) =>
      dispatch({ type: 'ADD', item: { ...item, qty } })
    const removeItem = (id) => dispatch({ type: 'REMOVE', id })
    const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty })
    const clearCart = () => dispatch({ type: 'CLEAR' })
    const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
    const totalPrice = state.items.reduce((sum, i) => sum + i.qty * i.price, 0)

    return { items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }
  }, [state.items])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
