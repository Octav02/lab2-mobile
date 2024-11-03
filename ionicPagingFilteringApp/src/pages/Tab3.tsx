import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Tab3.css';

const Tab3: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [searchBreed, setSearchBreed] = useState<string>('');

  async function fetchBreeds() {
    const url: string = 'https://dog.ceo/api/breeds/list/all';
    const res: Response = await fetch(url);
    res
      .json()
      .then(async (res) => {
        setBreeds(Object.keys(res.message || {}));
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchBreeds();
  }, []);

  console.log('Tab3', searchBreed);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          value={searchBreed}
          debounce={1000}
          onIonInput={e => setSearchBreed(e.detail.value!)}>
        </IonSearchbar>
        <IonList>
          {breeds
            .filter(breed => breed.indexOf(searchBreed) >= 0)
            .map(breed => <IonItem key={breed}>{breed}</IonItem>)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
