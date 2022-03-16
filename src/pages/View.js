import React, {useState, useEffect} from 'react';
import fireDb from '../firebase';
import {useParams, Link} from 'react-router-dom';
import './View.css';



const View = () => {
  const [stock, setStock] = useState({});
  
  const {id} = useParams();

  useEffect(() => {
    fireDb
      .child(`stock/${id}`)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setStock({ ...snapshot.val() })
        } else {
          setStock({});
        }
    });
  }, [id]);

  return (
    <div style={{marginTop: '150px'}}>
      <h2>{stock.itemName} 세부 정보</h2>

      <table className="styled-table">
        {/* <thead>
          <tr>
            <th>Lorem</th><th>Ipsum</th><th>Dolor</th>
          </tr>
        </thead> */}
        <tbody>
          <tr>
            <th>종목 명</th>
            <td>{stock.itemName}</td>
          </tr>
          <tr>
            <th>매수 날짜</th>
            <td>{stock.buyDay}</td>
          </tr>
          <tr>
            <th>매수 금액</th>
            <td>{stock.buyPrice ? stock.buyPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :' '}</td>
          </tr>
          <tr>
            <th>매도 날짜</th>
            <td>{stock.sellDay ? stock.sellDay : ''}</td>
          </tr>
          <tr>
            <th>매도 금액</th>
            <td>{stock.sellPrice ? stock.sellPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :' '}</td>
          </tr>
          <tr>
            <th>대비</th>
            <td>
              {!(stock.sellPrice) ? '' : 
                  // 매도 가격이 없으면 공백
                (stock.sellPrice - stock.buyPrice ) > 0 ? ` ▲ ${(stock.sellPrice - stock.buyPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} `
                  // 대비가 + 이면
                : `▽ ${(stock.sellPrice - stock.buyPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                  // 대비가 - 이면
              }
            </td>
          </tr>
          <tr>
            <th>등락률</th>
            <td>
              {!(stock.sellPrice) ? '' :
                // 매도 가격이 없으면 공백
                  (stock.sellPrice - stock.buyPrice ) > 0 ? `↑${(((stock.sellPrice - stock.buyPrice) / stock.buyPrice) * 100).toFixed(2)} % ` 
                // 매도가 + 이면
                  :`↓${(((stock.sellPrice - stock.buyPrice) / stock.buyPrice) * 100).toFixed(2)} % `
                // 매도가 - 이면
              }
            </td>
          </tr>
          <tr>
            <th>투자 기간</th>
            <td>                  
              {
                !(stock.sellDay) ? 
                  '' 
                    :
                  `${Math.floor(new Date(stock.sellDay).getTime() - new Date(stock.buyDay).getTime())/(1000 * 60 * 60 * 24)} 일`
              } </td>
          </tr>
        </tbody>
      </table>
  
      <br />
      <Link to = '/'>
        <button className="btn btn-edit">돌아가다</button>
      </Link>

      {/* <div className="card">
        <div className="card-header">
        </div>
        <div className="container">
          <strong>종목 명 :</strong>
          <sapn> {stock.itemName}</sapn>
          <br />
          <br />
          <strong>매수 일 :</strong>
          <sapn> {stock.buyDay}</sapn>
          <br />
          <br />
          <strong>매수 금액 :</strong>
          <sapn> {stock.buyPrice ? stock.buyPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :' '}</sapn>
          <br />
          <br />
          <strong>매도 일 :</strong>
          <sapn> {stock.sellDay ? stock.sellDay : ''}</sapn>
          <br />
          <br />
          <strong>매수 금액 :</strong>
          <sapn> {stock.sellPrice ? stock.sellPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :' '}</sapn>
          <br />
          <br />
          <strong>매수 금액 :</strong>
          <sapn> {stock.sellPrice ? stock.sellPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :' '}</sapn>
          <br />
          <br />
          <strong>대비 : </strong>
          <sapn>               
            {!(stock.sellPrice) ? '' : 
                // 매도 가격이 없으면 공백
              (stock.sellPrice - stock.buyPrice ) > 0 ? ` ▲ ${(stock.sellPrice - stock.buyPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} `
                // 대비가 + 이면
              : `▽ ${(stock.sellPrice - stock.buyPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                // 대비가 - 이면
            }</sapn>
          <br />
          <br />
          <strong>등락률 : </strong>
          <sapn>                   
            {!(stock.sellPrice) ? '' :
              // 매도 가격이 없으면 공백
                (stock.sellPrice - stock.buyPrice ) > 0 ? `↑${(((stock.sellPrice - stock.buyPrice) / stock.buyPrice) * 100).toFixed(2)} % ` 
              // 매도가 + 이면
                :`↓${(((stock.sellPrice - stock.buyPrice) / stock.buyPrice) * 100).toFixed(2)} % `
              // 매도가 - 이면
            }</sapn>
          <br />
          <br />
          <Link to = '/'>
            <button className="btn btn-edit">돌아가다</button>
          </Link>
        </div>
      </div> */}
    </div>
  )
}

export default View;
