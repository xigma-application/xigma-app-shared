import { expect, screen, userEvent, waitFor, within } from "storybook/test";

type TPlayContext = { canvasElement: HTMLElement };

export const playBasicMenu = async ({
  canvasElement,
}: TPlayContext): Promise<void> => {
  const canvas = within(canvasElement);
  const trigger = canvas.getByRole("button", { name: "Open menu" });

  // result (before): items only mount once the menu is open
  await expect(canvas.queryByText("Undo")).not.toBeInTheDocument();

  // action
  await userEvent.click(trigger);

  // result: content portals to document.body (outside canvasElement)
  const item = await screen.findByRole("menuitem", { name: "Undo" });
  await expect(item).toBeVisible();

  // after: close so the rest of the page is no longer aria-hidden
  await userEvent.keyboard("{Escape}");
  await waitFor(() =>
    expect(
      screen.queryByRole("menuitem", { name: "Undo" }),
    ).not.toBeInTheDocument(),
  );
};

export const playRichMenu = async ({
  canvasElement,
}: TPlayContext): Promise<void> => {
  const canvas = within(canvasElement);

  // action
  await userEvent.click(canvas.getByRole("button", { name: "Edit" }));

  // result: the submenu trigger renders inside the open menu, still collapsed
  const subTrigger = await screen.findByRole("menuitem", { name: /Transform/ });
  await expect(subTrigger).toHaveAttribute("data-state", "closed");

  // action
  await userEvent.hover(subTrigger);

  // result: useDelayedSubOpen opens the submenu after MENU_SUB_HOVER_OPEN_DELAY_MS
  const subItem = await screen.findByRole(
    "menuitem",
    { name: "Rotate 90°" },
    { timeout: 3000 },
  );
  await expect(subItem).toBeVisible();

  // after: close so the rest of the page is no longer aria-hidden
  await userEvent.keyboard("{Escape}");
  await userEvent.keyboard("{Escape}");
  await waitFor(() =>
    expect(
      screen.queryByRole("menuitem", { name: /Transform/ }),
    ).not.toBeInTheDocument(),
  );
};
