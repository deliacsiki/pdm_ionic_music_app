import { RouteComponentProps } from "react-router";
import React, { useContext } from "react";
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import Item from "./Item";
import { ItemContext } from "./api/ItemProvider";
import { add } from "ionicons/icons";
import Spinner from './UI/Spinner/Spinner';

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);

  const content = items && (
    <IonList>
      {items.map(({ id, name, artist, releaseDate, downloaded }) => (
        <Item
          key={id}
          id={id}
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
        <IonToolbar>
          <IonTitle>A list of songs</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {fetching ? <Spinner show={fetching} /> : content}
        {fetchingError && (
          <div>{fetchingError.message || "Failed to fetch flights"}</div>
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
