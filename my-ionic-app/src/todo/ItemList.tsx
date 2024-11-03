import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { NetworkState } from '../pages/NetworkState';
import { AuthContext } from '../auth/AuthProvider';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemList');
const itemsPerPage = 15;

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { logout } = useContext(AuthContext);

  const [index, setIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [itemsAux, setItemsAux] = useState<ItemProps[] | undefined>([]);
  const [more, setHasMore] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  function handleLogout() {
    logout?.();
    history.push('/login');
  }
  log('render', fetching);

  useEffect(() => {
    if (fetching) setIsOpen(true);
    else setIsOpen(false);
  }, [fetching]);

  // Pagination
  useEffect(() => {
    filterAndSearchItems();
  }, [items, searchTerm, maxPrice]);

  function filterAndSearchItems() {
    if (items) {
      let filteredItems = items;

      // Filter by search term (model name)
      if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
          item.model.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by max price
      if (maxPrice !== undefined) {
        filteredItems = filteredItems.filter(item => item.price <= maxPrice);
      }

      const newIndex = Math.min(index + itemsPerPage, filteredItems.length);
      setItemsAux(filteredItems.slice(0, newIndex));
      setIndex(newIndex);
      setHasMore(newIndex < filteredItems.length);
    }
  }

  async function searchNext(event: CustomEvent<void>) {
    await filterAndSearchItems();
    await (event.target as HTMLIonInfiniteScrollElement).complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Item List</IonTitle>
          <NetworkState />
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={fetching} message="Fetching items" />

        {/* Search and Filter Inputs */}
        <IonItem>
          <IonLabel>Search Model</IonLabel>
          <IonInput
            value={searchTerm}
            placeholder="Enter model name"
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            debounce={300} // Real-time with a debounce to reduce rapid state updates
          />
        </IonItem>
        <IonItem>
          <IonLabel>Max Price</IonLabel>
          <IonInput
            type="number"
            value={maxPrice}
            placeholder="Enter max price"
            onIonInput={(e) => setMaxPrice(e.detail.value ? parseFloat(e.detail.value) : undefined)}
          />
        </IonItem>

        {itemsAux && (
          <IonList>
            {itemsAux.map(({ _id, model, sellDate, price, isElectric }) => (
              <Item
                key={_id}
                _id={_id}
                price={price}
                isElectric={isElectric}
                model={model}
                sellDate={sellDate}
                onEdit={(id) => history.push(`/item/${id}`)}
              />
            ))}
          </IonList>
        )}
        <IonInfiniteScroll
          threshold="100px"
          disabled={!more}
          onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
        >
          <IonInfiniteScrollContent loadingText="Loading more items..." />
        </IonInfiniteScroll>
        {fetchingError && <div>{fetchingError.message || 'Failed to fetch items'}</div>}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonToast isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} message="Fetching items..." duration={2000} />
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
