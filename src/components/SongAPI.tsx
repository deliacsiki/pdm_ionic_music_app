import { Plugins } from "@capacitor/core";
import axios from "axios";
import { authConfig, baseUrl, getLogger, withLogs } from "../core";
import { Song } from "./Song";

const { Storage } = Plugins;
const itemUrl = `http://${baseUrl}/api/song`;

export const getItems: (token: string, page: number) => Promise<Song[]> = (
  token,
  page
) => {
  try {
    var result = axios.get(`${itemUrl}?page=${page}`, authConfig(token));

    result.then((res) => {
      res.data.forEach(async (song: Song) => {
        await Storage.set({
          key: song._id!,
          value: JSON.stringify({
            _id: song._id,
            name: song.name,
            artist: song.artist,
            releaseDate: song.releaseDate,
            downloaded: song.downloaded,
          }),
        });
      });
    });

    return withLogs(result, "getItems");
  } catch (e) {
    console.log("[Exception caught in SongAPI]: ", e);
  }
  
  return withLogs(Promise.reject(), "getItems");
};

export const createItem: (token: string, item: Song) => Promise<Song[]> = (
  token,
  item
) => {
  return withLogs(axios.post(itemUrl, item, authConfig(token)), "createItem");
};

export const updateItem: (token: string, item: Song) => Promise<Song[]> = (
  token,
  item
) => {
  return withLogs(
    axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)),
    "updateItem"
  );
};

interface MessageData {
  type: string;
  payload: Song;
}

const log = getLogger("ws");

export const newWebSocket = (
  token: string,
  onMessage: (data: MessageData) => void
) => {
  const ws = new WebSocket(`ws://${baseUrl}`);
  ws.onopen = () => {
    log("web socket onopen");
    ws.send(JSON.stringify({ type: "authorization", payload: { token } }));
  };
  ws.onclose = () => {
    log("web socket onclose");
  };
  ws.onerror = (error) => {
    log("web socket onerror", error);
  };
  ws.onmessage = (messageEvent) => {
    log("web socket onmessage");
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  };
};
