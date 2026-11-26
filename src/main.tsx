import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Development-only view used to render local treatment images from our own models.
const model = import.meta.env.DEV ? new URLSearchParams(location.search).get('asset') : null;
if (model === 'tooth' || model === 'arch' || model === 'implant') {
  import('./ToothScene').then(({default: Scene}) => ReactDOM.createRoot(document.getElementById('root')!).render(<div style={{width:'100vw',height:'100vh'}}><Scene mode={model} selected={-1} shade="bright" autoRotate={false} /></div>));
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
}
