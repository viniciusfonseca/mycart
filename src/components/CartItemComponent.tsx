import '@rmwc/card/styles';
import '@rmwc/textfield/styles';
import '@rmwc/icon-button/styles';
import { Card } from '@rmwc/card';
import { useCallback } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { CartItem, useAppStateManagerContext } from "../state-management";
import { TextField } from '@rmwc/textfield';
import { IconButton } from '@rmwc/icon-button';
import { useConfirmDeleteItemDialog } from './ConfirmDeleteItemDialog';

const styles = {
  field: { display: 'flex', flexDirection: 'column' },
  removeButton: {
    display: 'flex',
    height: '32px',
    width: '32px',
    border: '1px solid #0A0A0A',
    borderRadius: '50%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

type KeyUpEvent = JSXInternal.TargetedKeyboardEvent<HTMLInputElement>
type BlurEvent = JSXInternal.TargetedFocusEvent<HTMLInputElement>

export function CartItemComponent({ item }: { item: CartItem }) {

  const appStateManagerContext = useAppStateManagerContext()
  const confirmItemDeleteItemDialog = useConfirmDeleteItemDialog()

  const onNameKeyUp = useCallback((event: KeyUpEvent) => {
    appStateManagerContext.updateItem({ ...item, name: event.currentTarget.value ?? "" })
  }, [appStateManagerContext])

  const onPriceBlur = useCallback((event: BlurEvent) => {
    const price = event.currentTarget.value.replace(",", ".")
    appStateManagerContext.updateItem({ ...item, price: +price || 0 })
  }, [appStateManagerContext])

  const onQtyBlur = useCallback((event: BlurEvent) => {
    appStateManagerContext.updateItem({ ...item, qty: +event.currentTarget.value || 0 })
  }, [appStateManagerContext])

  const onRemoveButtonClick = useCallback(async () => {
    const confirmed = await confirmItemDeleteItemDialog.confirm()
    if (!confirmed) { return }
    appStateManagerContext.removeItem(item.id)
  }, [appStateManagerContext])


  return (
    <Card style={{ display: 'flex', flexDirection: 'row', padding: '6px', borderRadius: '4px', marginBottom: '12px', gap: '10px' }}>
      <div style={{ ...styles.field, width: '128px', flex: '1' }}>
        <TextField label="Nome" value={item.name} onKeyUp={onNameKeyUp} />
      </div>
      <div style={{ ...styles.field, width: '64px' }}>
        <TextField label="Preço" value={item.price.toFixed(2)} onBlur={onPriceBlur} />
      </div>
      <div style={{ ...styles.field, width: '64px' }}>
        <TextField label="Qtde" onKeyUp={onQtyBlur} value={item.qty.toFixed(0)} onBlur={onQtyBlur} />
      </div>
      <IconButton style={{ color: '#0A0A0A' }} icon="delete" label="Rate this!" onClick={onRemoveButtonClick} />
      { confirmItemDeleteItemDialog.jsx }
    </Card>
  )

}
