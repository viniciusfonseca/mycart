import './app.css'
import { AppStateManagerContext, saveCartToLocalStorage, useAppStateManager } from './state-management'
import { CartItemComponent } from './components/CartItemComponent'
import { CreateItemButton } from './components/CreateItemButton'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'preact/hooks'

const defaultInitialItems = [
  {
    id: uuidv4(),
    name: 'Pão de Forma',
    price: 7,
    qty: 1
  }
]

const BRLFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

export function App() {

  const localStoredCart = localStorage.getItem("cart")
  const initialItems = localStoredCart ? JSON.parse(localStoredCart) : defaultInitialItems
  const appStateManager = useAppStateManager(initialItems)
  const totalPrice = appStateManager.items.reduce((total, item) => total + +item.price * item.qty, 0)
  const totalPriceText = BRLFormatter.format(totalPrice)

  useEffect(() => {
    saveCartToLocalStorage(appStateManager.items)
  }, [appStateManager])

  return (
    <AppStateManagerContext.Provider value={appStateManager}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h2> My Cart </h2>
        <p> Preço total: {totalPriceText} </p>
        { appStateManager.items.map(item => <CartItemComponent key={item.id} item={item} />) }
        <CreateItemButton />
      </div>
    </AppStateManagerContext.Provider>
  )

}
