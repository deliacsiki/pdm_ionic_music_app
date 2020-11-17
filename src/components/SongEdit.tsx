import {RouteComponentProps} from "react-router";
import {Song} from "./Song";
import React, {useContext, useEffect, useState} from "react";
import {ItemContext} from "./SongProvider";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonLoading,
    IonRadio,
    IonDatetime,
    IonRadioGroup,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonItem
} from '@ionic/react';

interface ItemEditProps extends RouteComponentProps< {
    id?: string
}>{}


const ItemEdit: React.FC<ItemEditProps> = ({history, match}) => {
    const {items, saving, savingError, saveItem} = useContext(ItemContext)
    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [releaseDate, setRealeaseDate] = useState(new Date());
    const [downloaded, setDownloaded] = useState(false);
    const [item, setItems] = useState<Song>();

    useEffect(() => {
       const routeId = match.params.id || '';
       const item = items?.find(it => it._id === routeId);
       setItems(item);
       if (item){
        setName(item.name);
        setArtist(item.artist);
        setRealeaseDate(item.releaseDate);
        setDownloaded(item.downloaded);
       }
    }, [match.params.id, items]);

    const handleSave = () => {
        const editedItem = item ? { ...item, name, artist, releaseDate, downloaded } : { name, artist, releaseDate, downloaded}
        saveItem && saveItem(editedItem).then(() => history.goBack());
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Make modifications on one song</IonTitle>
                    <IonButtons slot="end">
                        <IonButton fill="outline" color="primary" onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLabel>Song name</IonLabel>
                <IonInput value={name} onIonChange={e => setName(e.detail.value || '')}/>
                <IonLabel>Song artist</IonLabel>
                <IonInput value={artist} onIonChange={e => setArtist(e.detail.value || '')}/>
                <IonLabel>Release Date</IonLabel>
                <IonDatetime displayFormat="DD - MM - YYYY" placeholder="Select Release Date" value={releaseDate.toString()} onIonChange={e => setRealeaseDate(new Date(Date.parse(e.detail.value!)))}></IonDatetime>
                <IonLabel>Downloaded</IonLabel>
                <IonRadioGroup value={downloaded} onIonChange={e => setDownloaded(e.detail.value)}>
                    <IonItem>
                        <IonLabel>
                            Yes
                        </IonLabel>
                        <IonRadio slot="start" value={true}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            No
                        </IonLabel>
                        <IonRadio slot="start" value={false}/>
                    </IonItem>
                </IonRadioGroup>
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save song'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ItemEdit