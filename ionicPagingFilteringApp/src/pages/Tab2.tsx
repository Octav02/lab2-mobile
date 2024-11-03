import {
  IonCard,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './Tab1.css';

const Tab2: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

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

  async function fetchData(reset?: boolean) {
    const dogs: string[] = reset ? [] : items;
    const url: string = filter ? `https://dog.ceo/api/breed/${filter}/images/random/3` : 'https://dog.ceo/api/breeds/image/random/3';
    const res: Response = await fetch(url);
    res
      .json()
      .then(async (res) => {
        if (res && res.message && res.message.length > 0) {
          setItems([...dogs, ...res.message]);
          setDisableInfiniteScroll(res.message.length < 3);
        } else {
          setDisableInfiniteScroll(true);
        }
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchData(true);
  }, [filter]);

  async function searchNext($event: CustomEvent<void>) {
    await fetchData();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  useEffect(() => {
    fetchBreeds();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab Two</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSelect value={filter} placeholder="Select Breed" onIonChange={e => setFilter(e.detail.value)}>
          {breeds.map(breed => <IonSelectOption key={breed} value={breed}>{breed}</IonSelectOption>)}
        </IonSelect>
        {items.map((item: string, i: number) => {
          return <IonCard key={`${i}`}><img src={item}/></IonCard>
        })}
        <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                           onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
          <IonInfiniteScrollContent
            loadingText="Loading more good doggos...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
