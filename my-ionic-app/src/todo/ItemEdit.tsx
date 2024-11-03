import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';
import { isElement } from 'react-dom/test-utils';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [item, setItem] = useState<ItemProps>();
  const [model, setModel] = useState('');
  const [price, setPrice] = useState(0);
  const [isElectric, setIsElectric] = useState(false);
  const [sellDate, setSellDate] = useState(new Date());
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setModel(item.model);
      setSellDate(item.sellDate);
      setPrice(item.price);
      setIsElectric(item.isElectric);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    const editedItem = item ? { ...item, model,sellDate, price,isElectric} : { model,sellDate,price,isElectric};
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={model} onIonChange={e => setModel(e.detail.value || '')} />
        <IonInput value={sellDate.toString()} onIonChange={e => setSellDate(e.detail.value ? new Date(e.detail.value) : new Date())}/>
        <IonInput value={price} type="number" onIonChange={e => setPrice(parseInt(e.detail.value || '0'))}/>
        <IonCheckbox checked={item ? item.isElectric : isElectric} onIonChange={e => setIsElectric(e.detail.checked || false)}/>
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
