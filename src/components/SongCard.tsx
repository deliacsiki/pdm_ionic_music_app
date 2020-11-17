import { Song } from "./Song";
import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

interface SongExt extends Song {
  onEdit: (id?: string) => void;
}

const Item: React.FC<SongExt> = ({
  _id,
  name,
  artist,
  downloaded,
  onEdit,
}) => {
  return (
    <IonCard
      onClick={() => onEdit(_id)}
      color="white"
      style={{
        "marginBottom": "1.2rem",
        "border": "2px solid #ff4961",
      }}
    >
      <IonCardHeader>
        <IonCardTitle>{`${name}`}</IonCardTitle>
        <IonCardSubtitle>{`By ${artist}`}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {`You have ${downloaded ? "" : "not"} downloaded this song`}
      </IonCardContent>
    </IonCard>
  );
};

export default Item;
