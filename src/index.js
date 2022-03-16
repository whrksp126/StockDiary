import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import {store} from './redux/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// 앱에서 성능 측정을 시작하려면 결과를 기록하는 함수(예: reportWebVitals(console.log))를 전달하거나 분석 엔드포인트로 보냅니다. 자세히 알아보기: https://bit.ly/CRA-vitals
reportWebVitals();
