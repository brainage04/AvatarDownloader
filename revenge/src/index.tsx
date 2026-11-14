/*
 * AvatarDownloader
 * Copyright (c) 2026 brainage04
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { React, ReactNative as RN } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { showToast } from "@vendetta/ui/toasts";

import { type AvatarDownload, type AvatarUser, serverAvatar, userAvatar } from "../../common/avatar";

interface HeaderAvatarProps {
    user?: AvatarUser;
    guildId?: string;
    style?: unknown;
}

interface MediaManager {
    // The second argument is 1 for a GIF and 0 for a still image; the promise reports whether it was saved.
    downloadMediaAsset(url: string, kind: 0 | 1): Promise<boolean>;
}

let unpatch: (() => void) | undefined;

async function download({ url, filename }: AvatarDownload, mediaManager: MediaManager) {
    try {
        const saved = await mediaManager.downloadMediaAsset(url, filename.endsWith(".gif") ? 1 : 0);
        showToast(saved ? "Avatar saved" : "Could not save the avatar");
    } catch (error) {
        showToast(`Could not save the avatar: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function onLoad() {
    // HeaderAvatar is the large avatar on a user's profile sheet.
    const headerAvatar = findByName("HeaderAvatar", false);
    const mediaManager = findByProps("downloadMediaAsset") as MediaManager | undefined;
    const guildMemberStore = findByStoreName("GuildMemberStore");
    if (!headerAvatar || !mediaManager) {
        showToast("AvatarDownloader could not find Discord's profile avatar or media saver");
        return;
    }

    unpatch = after("default", headerAvatar, ([{ user, guildId, style }]: [HeaderAvatarProps], rendered) => {
        if (!user?.id || !rendered) return rendered;

        const openDialog = () => {
            const memberAvatar: string | undefined = guildId
                ? guildMemberStore?.getMember(guildId, user.id)?.avatar ?? undefined
                : undefined;
            showConfirmationAlert({
                title: "Download avatar",
                content: `Save ${user.username}'s profile picture to your Downloads folder.`,
                confirmText: "Avatar",
                onConfirm: () => void download(userAvatar(user), mediaManager),
                secondaryConfirmText: guildId && memberAvatar ? "Server avatar" : undefined,
                onConfirmSecondary: guildId && memberAvatar
                    ? () => void download(serverAvatar(user, guildId, memberAvatar), mediaManager)
                    : undefined,
                cancelText: "Cancel"
            });
        };

        return (
            <RN.Pressable onLongPress={openDialog} style={style}>
                {React.cloneElement(rendered, { style: undefined })}
            </RN.Pressable>
        );
    });
}

function onUnload() {
    unpatch?.();
    unpatch = undefined;
}

export default { onLoad, onUnload };
