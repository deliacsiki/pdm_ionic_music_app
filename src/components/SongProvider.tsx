import React, { useCallback, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import { Song } from "./Song";
import { createItem, getItems, newWebSocket, updateItem } from "./SongAPI";
import { AuthContext } from "../auth";
import { Storage } from "@capacitor/core";

const log = getLogger("ItemProvider");

type SaveItemFn = (item: Song) => Promise<any>;

export interface ItemsState {
  items?: Song[];
  fetching: boolean;
  fetchingError?: Error | null;
  saving: boolean;
  savingError?: Error | null;
  saveItem?: SaveItemFn;
}

interface ActionProps {
  type: string;
  payload?: any;
}

const initialState: ItemsState = {
  fetching: false,
  saving: false,
};

const FETCH_ITEMS_STARTED = "FETCH_ITEMS_STARTED";
const FETCH_ITEMS_SUCCEEDED = "FETCH_ITEMS_SUCCEEDED";
const FETCH_ITEMS_FAILED = "FETCH_ITEMS_FAILED";
const SAVE_ITEM_STARTED = "SAVE_ITEM_STARTED";
const SAVE_ITEM_SUCCEEDED = "SAVE_ITEM_SUCCEEDED";
const SAVE_ITEM_FAILED = "SAVE_ITEM_FAILED";

const reducer: (state: ItemsState, action: ActionProps) => ItemsState = (
  state,
  { type, payload }
) => {
  switch (type) {
    case FETCH_ITEMS_STARTED:
      return { ...state, fetching: true, fetchingError: null };
    case FETCH_ITEMS_SUCCEEDED:
      return { ...state, items: payload.items, fetching: false };
    case FETCH_ITEMS_FAILED:
      return { ...state, fetchingError: payload.error, fetching: false };
    case SAVE_ITEM_STARTED:
      return { ...state, savingError: null, saving: true };
    case SAVE_ITEM_SUCCEEDED:
      const items = [...(state.items || [])];
      const item = payload.item;
      const index = items.findIndex((it) => it._id === item._id);
      if (index === -1) {
        items.splice(0, 0, item);
      } else {
        items[index] = item;
      }
      return { ...state, items, saving: false };
    case SAVE_ITEM_FAILED:
      return { ...state, savingError: payload.error, saving: false };
    default:
      return state;
  }
};

export const ItemContext = React.createContext<ItemsState>(initialState);

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, fetching, fetchingError, saving, savingError } = state;
  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, [token]);
  const saveItem = useCallback<SaveItemFn>(saveItemCallback, [token]);
  const value = {
    items,
    fetching,
    fetchingError,
    saving,
    savingError,
    saveItem,
  };
  log("returns");
  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    };

    async function fetchItems() {
      if (!token?.trim()) {
        return;
      }
      try {
        log("fetchItems started");
        dispatch({ type: FETCH_ITEMS_STARTED });
        const items = await getItems(token, 1);
        log("fetchItems succeeded");
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
        }
      } catch (error) {
        log("fetchItems failed");
        log("fetchItems from local storage started");

        const allKeys = Storage.keys();
        let promisedItems;
        var i;

        promisedItems = await allKeys.then(function (allKeys) {
          const promises = [];

          for (i = 0; i < allKeys.keys.length; ++i) {
            const promiseItem = Storage.get({ key: allKeys.keys[i] });
            promises.push(promiseItem);
          }

          return promises;
        });

        const songs = [];

        for (i = 0; i < promisedItems.length; ++i) {
          const promise = promisedItems[i];
          const song = await promise.then(function (it) {
            try {
              var object = JSON.parse(it.value);
            } catch (e) {
              return null;
            }

            return object;
          });

          if (song != null) {
            songs.push(song);
          }
        }

        if (songs.length > 0) {
          log("fetchItems from local storage successful");
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items: songs } });
        } else {
          log("fetchItems from local storage failed");
          dispatch({ type: FETCH_ITEMS_FAILED, payload: { error: new Error("Fetched entities had no length") } });
        }
      }
    }
  }

  async function saveItemCallback(item: Song) {
    try {
      log("saveItem started");
      dispatch({ type: SAVE_ITEM_STARTED });
      const savedItem = await (item._id
        ? updateItem(token, item)
        : createItem(token, item));
      log("saveItem succeeded");
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
    } catch (error) {
      log("saveItem failed");
      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    let canceled = false;
    log("wsEffect - connecting");
    let closeWebSocket: () => void;
    if (token?.trim()) {
      closeWebSocket = newWebSocket(token, (message) => {
        if (canceled) {
          return;
        }
        // eslint-disable-next-line
        const { type, payload: item } = message;
        log(`ws message, item ${type}`);
        if (type === "created" || type === "updated") {
          dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
        }
      });
    }
    return () => {
      log("wsEffect - disconnecting");
      canceled = true;
      closeWebSocket?.();
    };
  }
};
