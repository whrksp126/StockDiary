import { getAuth } from 'firebase/auth';
import React, {useState, useEffect} from 'react';
import { useLocation, Link } from 'react-router-dom';
import fireDb from '../firebase';
import './Search.css'

const Search = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  let uid;
  if(auth.currentUser !== null){
    uid = user.uid;
  }
  useEffect(()=>{
    
  },[uid])

  const [data, setData] = useState({});

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();
  let search = query.get('itemName');
  // console.log('search',search)

  const searchData = () =>{
    fireDb
    .child('stock')
    .orderByChild('itemName')
    // .equalTo(search)
    .startAt(search.toUpperCase()).endAt(search+'\uf8ff')
    // toUpperCase() 대소문자 구분없이 검색 가능
    // \uf8ff 는 유사 내용 검색 가능
    .on('value', (snapshout) => {
      if(snapshout.val()){
        const data = snapshout.val();
        setData(data);
      } else {
        setData({});
      }
    })
  }

  useEffect(() => {
    searchData()
  }, [search]);


  // console.log('data', data)
  // console.log('query', query)
  // console.log('Object', Object.keys(data).length)

  return (
    <>
      <div style={{marginTop: '100px'}}>
        {Object.keys(data).length === 0 ? (
          <h2>{query.get('itemName')} 에 대한 검색 결과가 없습니다.</h2>
        ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>No.</th>
              <th style={{ textAlign: 'center' }}>종목 명</th>
              <th style={{ textAlign: 'center' }}>매수 날짜</th>
              <th style={{ textAlign: 'center' }}>매수 가격</th>
              <th style={{ textAlign: 'center' }}>매도 날짜</th>
              <th style={{ textAlign: 'center' }}>매도 가격</th>
              <th style={{ textAlign: 'center' }}>대비</th>
              <th style={{ textAlign: 'center' }}>등락률</th>
              <th style={{ textAlign: 'center' }}>투자 기간</th>
              <th style={{ textAlign: 'center' }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((id, index)=>{
              if(data[id].uid === uid){
                return (
                  <tr key={id}>
                    <th scope="row" >{index + 1}</th>
                    <td>
                      <Link 
                        style={{ 
                          textDecoration: 'none', 
                          color: 'black', 
                        }} 
                        to={`/view/${id}`}>{data[id].itemName}
                      </Link>
                    </td>
                    
                    {/* 종목 명 */}
  
                    <td>{data[id].buyDay}</td>
                    {/* 매수 날짜 */}
  
                    <td>{data[id].buyPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                    {/* 매수 금액 */}
  
                    <td>{data[id].sellDay ? data[id].sellDay : (null)}</td>
                    {/* 매도 날짜 */}
  
                    <td>{data[id].sellPrice ? data[id].sellPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :' '}</td>
                    {/* 매도 금액 */}
  
                    <td>
                      {!(data[id].sellPrice) ? (null) : 
                      // 매도 가격이 없으면 공백
                    (data[id].sellPrice - data[id].buyPrice ) > 0 ? ` ▲ ${(data[id].sellPrice - data[id].buyPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} `
                      // 대비가 + 이면
                    : `▽ ${(data[id].sellPrice - data[id].buyPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                      // 대비가 - 이면
                    }
                    </td>
                    {/* 대비 */}
  
                    <td>
                      {!(data[id].sellPrice) ? (null) :
                      // 매도 가격이 없으면 공백
                        (data[id].sellPrice - data[id].buyPrice ) > 0 ? `↑${(((data[id].sellPrice - data[id].buyPrice) / data[id].buyPrice) * 100).toFixed(2)} % ` 
                      // 매도가 + 이면
                        :`↓${(((data[id].sellPrice - data[id].buyPrice) / data[id].buyPrice) * 100).toFixed(2)} % `
                      // 매도가 - 이면
                      }
                    </td>
                    {/* 등락률 */}
  
                    <td>
                      {
                        !(data[id].sellDay) ? 
                          (null)
                            :
                            Math.floor(new Date(data[id].sellDay).getTime() - new Date(data[id].buyDay).getTime())/(1000 * 60 * 60 * 24) < 365 
                            ? 
                            //  ('365일 이하인 경우')
                            `${Math.floor(new Date(data[id].sellDay).getTime() - new Date(data[id].buyDay).getTime())/(1000 * 60 * 60 * 24) } 일`
                            : 
                            `${
                              Math.floor(new Date(data[id].sellDay).getFullYear() - new Date(data[id].buyDay).getFullYear())}년
                              
                            ${
                              new Date(data[id].sellDay).getMonth() < new Date(data[id].buyDay).getMonth() 
                              ?
                              Math.floor(new Date(data[id].sellDay).getMonth() - new Date(data[id].buyDay).getMonth() ) + 12 
                              :
                              Math.floor(new Date(data[id].sellDay).getMonth() - new Date(data[id].buyDay).getMonth())}월
  
                              ${
                                new Date(data[id].sellDay).getDate() < new Date(data[id].buyDay).getDate() 
                                ?
                                Math.floor(new Date(data[id].sellDay).getDate() - new Date(data[id].buyDay).getDate() ) + 30 
                                :
                                Math.floor(new Date(data[id].sellDay).getDate() - new Date(data[id].buyDay).getDate())}일
                            `
                      } 
                    </td>
                    {/* 투자 기간 */}
                    <td>{data[id].status}</td>
                  </tr>
                )
              }
            })}
          </tbody>
        </table>
        )}        
        <Link to="/">
          <button style={{marginTop: '20px'}} className="btn btn-edit">
            되돌아가기
          </button>
        </Link>
      </div>
    </>
  )
}

export default Search
