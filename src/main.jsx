import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import App from './App.jsx';
import store from './store/index.js';

const rootElement = document.getElementById('root');
const root  = createRoot(rootElement);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);