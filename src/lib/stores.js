import { writable } from "svelte/store";

let new_action_store = writable([]);

let events_store = writable([]);

export { new_action_store, events_store };