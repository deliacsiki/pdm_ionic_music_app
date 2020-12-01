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
  IonItem,
  IonLabel,
  IonIcon,
  IonCheckbox,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import Item from "./SongCard";
import { ItemContext } from "./SongProvider";
import { add } from "ionicons/icons";
import Spinner from "./UI/Spinner/Spinner";
import { getLogger } from "../core";
import { AuthContext } from "../auth/AuthProvider";
import { Song } from "./Song";
import {getItems} from './SongAPI';

import "./SongCardList.css";

const log = getLogger("ItemList");

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { token } = useContext(AuthContext);
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const [filteredItems, setFilteredItems] = useState<Song[]>([]);
  const [filterByDownloaded, setFilterByDownloaded] = useState<boolean>(false);
  const { logout } = useContext(AuthContext);
  const [searchText, setSearchText] = useState<string>("");
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2);


  log("render");

  useEffect(() => setFilteredItems([...(items ? items : [])]), [items]);

  async function fetchData(reset?: boolean) {
    const res = await getItems(token, page);
    setFilteredItems([...filteredItems, ...res]);
    setDisableInfiniteScroll(res.length < 3);
    setPage(page + 1);
  };

  async function searchNext($event: CustomEvent<void>) {
    await fetchData();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  const content = filteredItems && (
    <IonList>
      {filteredItems
        .filter((i) => {
          if (filterByDownloaded) {
            return (
              (i.name.toLowerCase().includes(searchText) ||
                i.artist.toLowerCase().includes(searchText)) &&
              i.downloaded
            );
          } else
            return (
              i.name.toLowerCase().includes(searchText) ||
              i.artist.toLowerCase().includes(searchText)
            );
        })
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
          <IonButton
            id="song-cardlist-logoutBtn"
            fill="outline"
            color="danger"
            onClick={logout}
          >
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar
          placeholder="Search by song name or artist"
          onIonChange={(event) =>
            setSearchText(event.detail.value ? event.detail.value.toLowerCase() : "")
          }
        ></IonSearchbar>
        <IonItem>
          <IonCheckbox
            color="danger"
            style={{marginRight:"1rem"}}
            checked={filterByDownloaded}
            onIonChange={(e) => setFilterByDownloaded(e.detail.checked)}
          />
          <IonLabel> Show downloaded songs</IonLabel>
        </IonItem>

        {fetching ? <Spinner show={fetching} /> : content}
        {fetchingError && (
          <div>{fetchingError.message || "Failed to fetch songs"}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push("/item")}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonInfiniteScroll threshold="40px"
           disabled={disableInfiniteScroll}
          onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
          <IonInfiniteScrollContent
            loadingText="Loading more products...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>

      </IonContent>
    </IonPage>
  );
};

export default ItemList;
