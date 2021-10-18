import { writable } from "svelte/store";

let new_action_store = writable([]);

let events_store = writable([]);

let user_store = writable([]);

export { new_action_store, events_store, user_store };