import {Song} from "./Song";
import React from "react";
import {IonItem, IonLabel} from "@ionic/react";

interface FlightExt extends Song {
    onEdit: (id?: string) => void;
}

const Item: React.FC<FlightExt> = ({id, name, artist, releaseDate, downloaded, onEdit}) => {
    return (
        <IonItem onClick={() => onEdit(id)}>
            <IonLabel>
                {`Song name: ${name}`}
            </IonLabel>
            <IonLabel>
                {`Song artist: ${artist}`}
            </IonLabel>
            <IonLabel>
                {`Release date: ${releaseDate}`}
            </IonLabel>
            <IonLabel>
                {`Is downloaded: ${downloaded ? 'Yes' : 'No'}`}
               
            </IonLabel>
        </IonItem>
    );
};

export default Item;