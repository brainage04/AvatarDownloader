/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 brainage04
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { showNotification } from "@api/Notifications";
import { CloudDownloadIcon } from "@components/Icons";
import { Logger } from "@utils/Logger";
import type { PluginDef } from "@utils/types";
import { saveFile } from "@utils/web";
import type { User } from "@vencord/discord-types";
import { GuildMemberStore, Menu, showToast } from "@webpack/common";

import { type AvatarDownload, serverAvatar, userAvatar } from "../common/avatar";
import { createNotifier } from "../common/notify";

const logger = new Logger("AvatarDownloader");
const notify = createNotifier({
    toast: showToast,
    fallback: ({ text, variant }) => showNotification({
        title: "Avatar Downloader",
        body: text,
        color: variant === "critical" ? "var(--red-360)" : variant === "success" ? "var(--green-360)" : undefined
    }),
    log: (message, error) => logger.error(message, error)
});

async function download({ url, filename }: AvatarDownload) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const image = await response.blob();
        saveFile(new File([image], filename, { type: image.type }));
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        notify({ text: `Could not download the avatar: ${reason}`, variant: "critical" });
    }
}

const userContextMenuPatch: NavContextMenuPatchCallback = (children, { user, guildId }: { user?: User; guildId?: string; }) => {
    if (!user) return;
    const memberAvatar = guildId ? GuildMemberStore.getMember(guildId, user.id)?.avatar : undefined;

    children.splice(-1, 0, (
        <Menu.MenuGroup>
            <Menu.MenuItem
                id="avatar-downloader-avatar"
                label="Download Avatar"
                icon={CloudDownloadIcon}
                leadingAccessory={{ type: "icon", icon: CloudDownloadIcon }}
                action={() => void download(userAvatar(user))}
            />
            {guildId && memberAvatar && (
                <Menu.MenuItem
                    id="avatar-downloader-server-avatar"
                    label="Download Server Avatar"
                    icon={CloudDownloadIcon}
                    leadingAccessory={{ type: "icon", icon: CloudDownloadIcon }}
                    action={() => void download(serverAvatar(user, guildId, memberAvatar))}
                />
            )}
        </Menu.MenuGroup>
    ));
};

export const vencordPlugin = {
    description: "Adds Download Avatar to a user's right-click menu, and Download Server Avatar when they have one.",
    tags: ["Utility"],
    authors: [{ name: "brainage04", id: 0n }],
    contextMenus: {
        "user-context": userContextMenuPatch
    }
} satisfies Omit<PluginDef, "name">;
