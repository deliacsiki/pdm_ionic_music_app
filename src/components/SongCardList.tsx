import { RouteComponentProps } from "react-router";
import React, { useContext, useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonContent,
  IonList,
  IonFab,
  IonFabButton,
  IonButton,
  IonIcon,
} from "@ionic/react";
import Item from "./SongCard";
import { ItemContext } from "./SongProvider";
import { add } from "ionicons/icons";
import Spinner from "./UI/Spinner/Spinner";
import { getLogger } from "../core";
import { AuthContext } from "../auth/AuthProvider";
import { Song } from "./Song";

import "./SongCardList.css";

const log = getLogger("ItemList");

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const [filteredItems, setFilteredItems] = useState<Song[]>([]);
  const { logout } = useContext(AuthContext);
  const [searchText, setSearchText] = useState<string>("");
  log("render");

  useEffect(() => setFilteredItems([...(items ? items : [])]), [items]);

  const content = filteredItems && (
    <IonList>
      {filteredItems
        .filter(
          (i) =>
            i.name.toLowerCase().includes(searchText) ||
            i.artist.toLowerCase().includes(searchText)
        )
        .map(({ _id, name, artist, releaseDate, downloaded }) => (
          <Item
            key={_id}
            _id={_id}
            name={name}
            artist={artist}
            releaseDate={releaseDate}
            downloaded={downloaded}
            onEdit={(id) => history.push(`/item/${id}`)}
          />
        ))}
    </IonList>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="song-cardlist-toolbar">
          <IonTitle>Your songs</IonTitle>
          <IonButton id="song-cardlist-logoutBtn" fill="outline" color="danger" onClick={logout}>Logout</IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar
          placeholder="Search by song name or artist"
          onIonChange={(event) =>
            setSearchText(event.detail.value ? event.detail.value : "")
          }
        ></IonSearchbar>
        {fetching ? <Spinner show={fetching} /> : content}
        {fetchingError && (
          <div>{fetchingError.message || "Failed to fetch songs"}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push("/item")}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
