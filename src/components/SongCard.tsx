import { Song } from "./Song";
import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonLabel,
  IonIcon,
} from "@ionic/react";

import "./SongCard.css";

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
      className="song-card"
      onClick={() => onEdit(_id)}
      color="white"
    >
      <IonCardHeader>
        <IonCardTitle>{`${name}`}</IonCardTitle>
        <IonCardSubtitle>{`By ${artist}`}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent className="downloaded-card-section">
        <div>Downloaded?</div>
        {downloaded? <IonIcon name="checkmark" size="large" className="icon-white"></IonIcon> : <IonIcon name="close" size="large" className="icon-white"></IonIcon>}
      </IonCardContent>
    </IonCard>
  );
};

export default Item;
