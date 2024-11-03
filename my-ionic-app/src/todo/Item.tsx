import React from 'react';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, model, sellDate,price, isElectric, isNotSaved, onEdit }) => {
  const formattedSellDate = parseIsoDate(sellDate.toString());
    return (
        <IonItem onClick={() => onEdit(_id)}>
            <IonLabel>{model}</IonLabel>
            <IonLabel>{price}</IonLabel>
            <IonCheckbox slot="start" checked={isElectric}/>
            <IonLabel>{formattedSellDate}</IonLabel> 
            {isNotSaved && <IonLabel color="danger">Not saved</IonLabel>}
        </IonItem>
    );
};

function parseIsoDate(dateString: string): string {
  // Extract year, month, and day from the ISO string
  const dateParts = dateString.split('T')[0].split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  // Return formatted date as dd/MM/yyyy
  return `${day}/${month}/${year}`;
}

export default Item;
