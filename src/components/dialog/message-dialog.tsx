import * as i18n from "@solid-primitives/i18n";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useAppContext } from "@/context/app-context";
import { JSXElement, createEffect } from "solid-js";

export function MessageDialog(): JSXElement {
  const {
    dialog: { messageAlert: openMessageDialog, setMessageAlert: setOpenMessageDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  createEffect(() => {
    if (openMessageDialog() != null) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    setOpenMessageDialog(null);
  }

  function handleClose() {
    setOpenMessageDialog(null);
  }

  const message = () => {
    const key = openMessageDialog();
    return key != null ? t(key) : "";
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-4">{message()}</div>

        <ButtonsContainer>
          <button type="submit">OK</button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
