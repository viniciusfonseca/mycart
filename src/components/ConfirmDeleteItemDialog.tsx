import '@rmwc/dialog/styles';
import { Dialog, DialogActions, DialogButton, DialogContent, DialogTitle } from "@rmwc/dialog";
import { StateUpdater, useCallback, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";

class ConfirmDeleteItemController {

  constructor(
    public jsx: JSXInternal.Element,
    private setOpen: (newState: boolean) => void,
    private setResolver: StateUpdater<(_result: boolean) => null>
  ) {}

  confirm() {
    return new Promise(resolve => {
      this.setOpen(true)
      this.setResolver(() => resolve as any)
    })
  }
}

type DialogActionResult = "accept" | "close"

export function useConfirmDeleteItemDialog() {
  const [open, setOpen] = useState(false)
  const [resolver, setResolver] = useState(() => (_result: boolean) => null)

  const handleClose = useCallback((action: DialogActionResult) => {
    setOpen(false)
    switch (action) {
      case "accept": {
        resolver(true)
        break
      }
      case "close": {
        resolver(false)
        break
      }
    }
  }, [open, resolver])

  const jsx = (
    <Dialog open={open} onClose={(e: any) => handleClose(e.detail.action)}>
      <DialogTitle> Confirmar remoção </DialogTitle>
      <DialogContent> Deseja mesmo remover este item? </DialogContent>
      <DialogActions>
        <DialogButton action="close"> Cancelar </DialogButton>
        <DialogButton action="accept" isDefaultAction> Ok </DialogButton>
      </DialogActions>
    </Dialog>
  )

  return new ConfirmDeleteItemController(jsx, setOpen, setResolver)
}
