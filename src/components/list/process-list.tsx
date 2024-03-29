import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { ProcessEntity } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

export function ProcessList(): JSXElement {
  const {
    processModel: { processList, selectedProcess, addProcess, changeProcess },
    dialog: { setOpenDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  function handleItemMouseDown(process: ProcessEntity, _: MouseEvent) {
    if (selectedProcess().id !== process.id) {
      changeProcess(process);
    }
  }

  function handleItemDblClick(process: ProcessEntity, _: MouseEvent) {
    setOpenDialog({ type: "process", process });
  }

  function handleAddButtonClick(_: MouseEvent) {
    addProcess(processList());
  }

  function handleRemoveButtonClick(_: MouseEvent) {
    setOpenDialog({ type: "deleteProcess", process: selectedProcess() });
  }

  return (
    <div class="flex h-full flex-col">
      <h5>{t("process")}</h5>
      <div class="h-full overflow-y-auto overflow-x-hidden bg-background">
        <ul class="list-none">
          <For each={processList()}>
            {(it) => (
              <li
                data-select={it.id === selectedProcess().id}
                class="p-1 hover:bg-primary2 data-[select=true]:bg-primary1"
                onMouseDown={[handleItemMouseDown, it]}
                onDblClick={[handleItemDblClick, it]}
              >
                {it.detail.name}
              </li>
            )}
          </For>
        </ul>
      </div>

      <ButtonsContainer margin="4px 0 0 0">
        <button type="submit" onClick={handleAddButtonClick}>
          {t("add")}
        </button>
        <button
          type="button"
          onClick={handleRemoveButtonClick}
          disabled={processList().length === 1}
        >
          {t("delete")}
        </button>
      </ButtonsContainer>
    </div>
  );
}
