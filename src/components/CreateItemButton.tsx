import '@rmwc/button/styles';
import { useCallback } from "preact/hooks"
import { useAppStateManagerContext } from "../state-management"
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@rmwc/button';

export function CreateItemButton() {

  const appStateManagerContext = useAppStateManagerContext()
  const onClick = useCallback(() => {
    appStateManagerContext.includeItem({ id: uuidv4(), name: "Novo Item", price: 0, qty: 1 })
  }, [appStateManagerContext])

  return (
    <Button label="Incluir novo item" onClick={onClick} raised />
  )
}
