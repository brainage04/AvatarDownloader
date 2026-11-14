/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 brainage04
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "node:assert/strict";
import test from "node:test";

import { serverAvatar, userAvatar } from "./avatar";

test("a static avatar downloads as a full-size PNG", () => {
    assert.deepEqual(userAvatar({ id: "80351110224678912", username: "nelly", avatar: "8342729096ea3675442027381ff50dfe" }), {
        url: "https://cdn.discordapp.com/avatars/80351110224678912/8342729096ea3675442027381ff50dfe.png?size=4096",
        filename: "nelly-avatar.png"
    });
});

test("an animated avatar downloads as a GIF", () => {
    const { url, filename } = userAvatar({ id: "1", username: "a", avatar: "a_1269e74af4df7417b13759eae50c83dc" });
    assert.equal(url, "https://cdn.discordapp.com/avatars/1/a_1269e74af4df7417b13759eae50c83dc.gif?size=4096");
    assert.equal(filename, "a-avatar.gif");
});

test("a user without an avatar gets Discord's default avatar for their account type", () => {
    // (80351110224678912 >> 22) % 6 = 5, 1337 % 5 = 2
    assert.equal(userAvatar({ id: "80351110224678912", username: "nelly", discriminator: "0" }).url,
        "https://cdn.discordapp.com/embed/avatars/5.png");
    assert.equal(userAvatar({ id: "80351110224678912", username: "nelly", discriminator: "1337" }).url,
        "https://cdn.discordapp.com/embed/avatars/2.png");
});

test("a server avatar uses the guild member URL", () => {
    assert.deepEqual(serverAvatar({ id: "2", username: "bob" }, "3", "a_ff"), {
        url: "https://cdn.discordapp.com/guilds/3/users/2/avatars/a_ff.gif?size=4096",
        filename: "bob-server-avatar.gif"
    });
});

test("file names keep only safe characters", () => {
    assert.equal(userAvatar({ id: "1", username: "../we ird/ñame", avatar: "f" }).filename, "_we_ird_ame-avatar.png");
});
