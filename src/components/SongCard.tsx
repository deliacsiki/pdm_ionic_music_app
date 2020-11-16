import { Song } from "./Song";
import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

interface FlightExt extends Song {
  onEdit: (id?: string) => void;
}

const Item: React.FC<FlightExt> = ({
  id,
  name,
  artist,
  downloaded,
  onEdit,
}) => {
  return (
    <IonCard onClick={() => onEdit(id)}>
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
