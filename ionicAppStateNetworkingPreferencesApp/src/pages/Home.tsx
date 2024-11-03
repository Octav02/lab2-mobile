import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useAppState } from './useAppState';
import { useNetwork } from './useNetwork';
import { usePreferences } from './usePreferences';

const Home: React.FC = () => {
  const { appState } = useAppState();
  const { networkStatus } = useNetwork();
  usePreferences();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div>App state is {JSON.stringify(appState)}</div>
        <div>Network status is {JSON.stringify(networkStatus)}</div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
