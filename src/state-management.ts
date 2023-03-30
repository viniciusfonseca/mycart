import { createContext } from "preact"
import { useContext, useReducer } from "preact/hooks"

type AppStateActionType = "include_item" | "update_item" | "remove_item"

class AppStateAction<T = any> {
  constructor(public type: AppStateActionType, public payload: T) {}
}

class AppStateManager {
  constructor(public items: CartItem[], private dispatch: (action: AppStateAction) => void) {}

  includeItem(item: CartItem) {
    this.dispatch(new AppStateAction("include_item", item))
  }

  updateItem(item: CartItem) {
    this.dispatch(new AppStateAction("update_item", item))
  }

  removeItem(itemId: string) {
    this.dispatch(new AppStateAction("remove_item", itemId))
  }
}

export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

interface AppState {
  items: CartItem[]
}

export function useAppStateManager(initialItems: CartItem[]): AppStateManager {

  const reducer = (state: AppState, action: AppStateAction) => {
    switch (action.type) {
      case "include_item": {
        let payload = action.payload as CartItem
        return {
          ...state,
          items: state.items.concat(payload)
        } as AppState
      }
      case "update_item": {
        let new_data = action.payload as CartItem
        return {
          ...state,
          items: state.items.map(item => {
            if (item.id !== new_data.id) { return item }
            return { ...item, ...new_data }
          })
        }
      }
      case "remove_item": {
        let id = action.payload as string
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        }
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, { items: initialItems })

  return new AppStateManager(state.items, dispatch)
}

export const AppStateManagerContext = createContext<AppStateManager>(null as any)

export const useAppStateManagerContext = () => useContext(AppStateManagerContext)

export function saveCartToLocalStorage(items: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(items))
}
