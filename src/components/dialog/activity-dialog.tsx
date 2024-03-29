import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement, Match, Switch, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { dataFactory, deepUnwrap } from "../../data-source/data-factory";
import { ActivityNode } from "../../data-source/data-type";
import {
  AutoActivityIcon,
  AutoTimerActivityIcon,
  ManualActivityIcon,
  ManualTimerActivityIcon,
  UserActivityIcon,
} from "../icons/material-icons";
import { ButtonsContainer } from "../parts/buttons-container";
import { ToggleIconButton } from "../parts/toggle-icon-button";

const dummy = dataFactory.createActivityNode([], 0, "autoActivity", 0, 0);

export function ActivityDialog(): JSXElement {
  const {
    processModel: { selectedProcess },
    actorModel: { actorList },
    activityNodeModel: { updateActivity },
    dialog: { openDialog, setOpenDialog, setOpenMessageDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  const [formData, setFormData] = createStore<ActivityNode>(dummy);
  const [selectedAppIndex, setSelectedAppIndex] = createSignal(-1);

  createEffect(() => {
    const dialog = openDialog();
    if (dialog?.type === "activity") {
      const activity = deepUnwrap(dialog.activity);
      activity.applications = selectedProcess().detail.applications.map((app) => ({
        id: app.id,
        ognl: activity.applications.find((it) => it.id === app.id)?.ognl ?? "",
      }));
      setFormData(activity);
      setSelectedAppIndex(activity.applications.length > 0 ? 0 : -1);

      dialogRef?.showModal();
      if (radioTabCenterRef) {
        radioTabCenterRef.checked = true;
      }
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    const activity: ActivityNode = deepUnwrap(formData);
    activity.applications =
      activity.activityType === "autoActivity"
        ? formData.applications.filter((it) => it.ognl !== "")
        : [];
    activity.ognl =
      formData.activityType === "manualTimerActivity" ||
      formData.activityType === "autoTimerActivity"
        ? formData.ognl
        : "";
    const errorMessage = updateActivity(activity);
    if (errorMessage) {
      setOpenMessageDialog(errorMessage);
      return;
    }
    setOpenDialog(null);
  }

  function handleClose() {
    setOpenDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  let radioTabCenterRef: HTMLInputElement | undefined;
  return (
    <dialog class="w-[388px] bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">{t("editActivity")}</h5>

      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-2 flex flex-row">
          <ToggleIconButton
            id="manual-activity"
            title={t("manualActivity")}
            checked={formData.activityType === "manualActivity"}
            onChange={() => setFormData("activityType", "manualActivity")}
            margin="0 4px 0 0"
          >
            <ManualActivityIcon />
          </ToggleIconButton>
          <ToggleIconButton
            id="auto-activity"
            title={t("autoActivity")}
            checked={formData.activityType === "autoActivity"}
            onChange={() => setFormData("activityType", "autoActivity")}
            margin="0 4px 0 0"
          >
            <AutoActivityIcon />
          </ToggleIconButton>
          <ToggleIconButton
            id="manual-timer-activity"
            title={t("manualTimerActivity")}
            checked={formData.activityType === "manualTimerActivity"}
            onChange={() => setFormData("activityType", "manualTimerActivity")}
            margin="0 4px 0 0"
          >
            <ManualTimerActivityIcon />
          </ToggleIconButton>
          <ToggleIconButton
            id="auto-timer-activity"
            title={t("autoTimerActivity")}
            checked={formData.activityType === "autoTimerActivity"}
            onChange={() => setFormData("activityType", "autoTimerActivity")}
            margin="0 4px 0 0"
          >
            <AutoTimerActivityIcon />
          </ToggleIconButton>
          <ToggleIconButton
            id="user-activity"
            title={t("handWork")}
            checked={formData.activityType === "userActivity"}
            onChange={() => setFormData("activityType", "userActivity")}
          >
            <UserActivityIcon />
          </ToggleIconButton>
        </div>

        <div class="mb-2 flex flex-wrap">
          <input
            id="tab-join"
            type="radio"
            name="tab-switch"
            class="
              peer/tab-switch1
              b-0 absolute m-[-1px] h-[1px]
              w-[1px] overflow-hidden whitespace-nowrap p-0
              [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
          />
          <label
            class="
              -order-1 mr-1 bg-gray-300 px-2 py-1
              peer-checked/tab-switch1:bg-primary1"
            for="tab-join"
          >
            はじまり
          </label>
          <div
            class="
              hidden h-[300px] w-full border border-solid border-gray-300 py-4 pl-2
              peer-checked/tab-switch1:block"
            classList={{
              "bg-gray-100": formData.joinType === "notJoin" || formData.joinType === "oneJoin",
            }}
          >
            <div>
              <div>前の仕事が・・・</div>
              <div>
                <input
                  type="radio"
                  id="joinOne"
                  value="joinOne"
                  name="joinRadio"
                  disabled={formData.joinType === "notJoin" || formData.joinType === "oneJoin"}
                  checked={formData.joinType === "xorJoin"}
                  onChange={() => setFormData("joinType", "xorJoin")}
                />
                <label for="joinOne">ひとつでも終わったら</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="joinMany"
                  value="joinMany"
                  name="joinRadio"
                  disabled={formData.joinType === "notJoin" || formData.joinType === "oneJoin"}
                  checked={formData.joinType === "andJoin"}
                  onChange={() => setFormData("joinType", "andJoin")}
                />
                <label for="joinMany">すべて終わったら</label>
              </div>
              <div>この仕事を行う。</div>
            </div>
          </div>

          <input
            id="tab-work"
            type="radio"
            name="tab-switch"
            class="
              peer/tab-switch2
              b-0 absolute m-[-1px] h-[1px]
              w-[1px] overflow-hidden whitespace-nowrap p-0
              [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
            ref={radioTabCenterRef}
          />
          <label
            class="
              -order-1 mr-1 bg-gray-300 px-2 py-1
              peer-checked/tab-switch2:bg-primary1"
            for="tab-work"
          >
            仕事
          </label>
          <div
            class="
              hidden h-[300px] w-full border border-solid border-gray-300 py-4 pl-2
              peer-checked/tab-switch2:block"
          >
            <div class="grid grid-cols-[64px_266px] gap-2">
              <div>ID</div>
              <input
                type="text"
                value={formData.xpdlId}
                onChange={(e) => setFormData("xpdlId", e.target.value)}
              />

              <div>{t("jobTitle")}</div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData("name", e.target.value)}
              />

              <div>{t("actor")}</div>
              <select onChange={(e) => setFormData("actorId", Number(e.target.value))}>
                <For each={actorList}>
                  {(actor) => (
                    <option value={actor.id} selected={actor.id === formData.actorId}>
                      {actor.name}
                    </option>
                  )}
                </For>
              </select>

              <Switch>
                <Match when={formData.activityType === "autoActivity"}>
                  <div>処理内容 (OGNL)</div>
                  <div class="flex h-[160px] flex-col border-solid border-gray-300">
                    <select
                      disabled={selectedAppIndex() < 0}
                      value={selectedAppIndex()}
                      onChange={(e) => {
                        setSelectedAppIndex(Number(e.target.value));
                      }}
                    >
                      <For each={selectedProcess().detail.applications}>
                        {(app, index) => (
                          <option value={index()}>{`${app.name} (${app.xpdlId})`}</option>
                        )}
                      </For>
                    </select>
                    <textarea
                      class="mt-2 h-full resize-none"
                      disabled={selectedAppIndex() < 0}
                      value={
                        formData.applications[selectedAppIndex()]?.ognl ?? t("registerProcessApp")
                      }
                      onChange={(e) =>
                        setFormData("applications", [selectedAppIndex()], "ognl", e.target.value)
                      }
                    />
                  </div>
                </Match>
                <Match
                  when={
                    formData.activityType === "manualTimerActivity" ||
                    formData.activityType === "autoTimerActivity"
                  }
                >
                  <div>自動で実行するのはいつ？ (OGNL)</div>
                  <div class="h-[160px] w-[266px]">
                    <textarea
                      class="b-0 h-full w-full resize-none"
                      value={formData.ognl}
                      onChange={(e) => setFormData("ognl", e.target.value)}
                    />
                  </div>
                </Match>
              </Switch>
            </div>
          </div>

          <input
            id="tab-split"
            type="radio"
            name="tab-switch"
            class="
              peer/tab-switch3
              b-0 absolute m-[-1px] h-[1px]
              w-[1px] overflow-hidden whitespace-nowrap p-0
              [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
          />
          <label
            class="
              -order-1 mr-1 bg-gray-300 px-2 py-1
              peer-checked/tab-switch3:bg-primary1"
            for="tab-split"
          >
            終わったら
          </label>
          <div
            class="
              hidden h-[300px] w-full border border-solid border-gray-300 py-4 pl-2
              peer-checked/tab-switch3:block"
            classList={{
              "bg-gray-100": formData.splitType === "notSplit" || formData.splitType === "oneSplit",
            }}
          >
            <div>
              <div>後続の仕事への接続条件を満たす・・・</div>
              <div>
                <input
                  type="radio"
                  id="splitOne"
                  value="splitOne"
                  name="splitRadio"
                  disabled={formData.splitType === "notSplit" || formData.splitType === "oneSplit"}
                  checked={formData.splitType === "xorSplit"}
                  onChange={() => setFormData("splitType", "xorSplit")}
                />
                <label for="splitOne">どれかひとつ</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="splitMany"
                  value="splitMany"
                  name="splitRadio"
                  disabled={formData.splitType === "notSplit" || formData.splitType === "oneSplit"}
                  checked={formData.splitType === "andSplit"}
                  onChange={() => setFormData("splitType", "andSplit")}
                />
                <label for="splitMany">すべて</label>
              </div>
              <div>に続く</div>
            </div>
          </div>
        </div>

        <ButtonsContainer>
          <button type="submit">OK</button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
