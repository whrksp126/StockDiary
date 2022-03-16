import React, {useState, useEffect, useRef} from 'react';
import fireDb from '../firebase';
import {Link} from 'react-router-dom';
import './Home.css'
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import { logoutInitiate } from '../redux/actions';
import Login from './Login';
import { getAuth } from 'firebase/auth';

const Home = () => {
  const [data, setData] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [sort, setSort] = useState(false);
  const [status, setStatus] = useState(false);
  const selectRef = useRef(null);

  const {currentUser} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const auth = getAuth();
  const user = auth.currentUser;
  let uid;
  if(auth.currentUser !== null){
    uid = user.uid;
  }
  useEffect(()=>{
    
  },[uid])

  useEffect(() => {
    fireDb.child('stock').on('value', (snapshot) => {
      if(snapshot.val() !== null){
        setData({...snapshot.val()})
        console.log(data)
      } else {
        setData({})
      }
    });

    return () => {
      setData({});
    };
  }, []);

  const onDelete = (id) => {
    if(window.confirm('해당 종목을 정말 삭제하시겠습니까?')){
      fireDb.child(`stock/${id}`).remove((err) => {
        if(err){
          toast.error(err)
        } else {
          toast.success('종목 삭제를 성공하였습니다.')
        }
      })  
    }
  }

  const handleChange = (e) => {
    setSort(true); 
    const value = e.target.value
    console.log(value)
    if ( value === 'itemName' ){
      if(!status){
        console.log('상태 선택 안함')
        fireDb.child('stock').orderByChild(`${e.target.value}`).on('value', (snapshot) => {
          let sortedData = [];
          snapshot.forEach((snap)=>{
            console.log(snap.val());
            sortedData.push(snap.val());
          });
          setSortedData(sortedData);
          console.log(sortedData)
        })
      } else {
        console.log('상태 선택 함');
        let sortedData = [];
        Object.keys(data).forEach(function(v){
          sortedData.push(data[v])
        });
        setSortedData(sortedData.sort(function(a, b){
          const nameA = a.itemName.toUpperCase();
          const nameB = b.itemName.toUpperCase();
          if(nameA < nameB) { return -1; }
          if(nameA > nameB) { return 1; }
          return 0;
        }));
      }
    } else if (value === 'buyDay') {
      if(!status){
        console.log('상태 선택 안함')
        fireDb.child('stock').orderByChild(`${e.target.value}`).on('value', (snapshot) => {
          let sortedData = [];
          snapshot.forEach((snap)=>{
            console.log(snap.val());
            sortedData.push(snap.val());
          });
          setSortedData(sortedData);
          console.log(sortedData)
        })
      } else {
        console.log('상태 선택 함');
        let sortedData = [];
        Object.keys(data).forEach(function(v){
          sortedData.push(data[v])
        });
        setSortedData(sortedData.sort(function(a, b){
          const nameA = a.buyDay;
          const nameB = b.buyDay;
          if(nameA < nameB) { return -1; }
          if(nameA > nameB) { return 1; }
          return 0;
        }));
      }
    } else if (value === 'sellDay') {
      if(!status){
        console.log('상태 선택 안함')
        fireDb.child('stock').orderByChild(`${e.target.value}`).on('value', (snapshot) => {
          let sortedData = [];
          snapshot.forEach((snap)=>{
            console.log(snap.val());
            sortedData.push(snap.val());
          });
          setSortedData(sortedData);
          console.log(sortedData)
        })
      } else {
        console.log('상태 선택 함');
        let sortedData = [];
        Object.keys(data).forEach(function(v){
          sortedData.push(data[v])
        });
        setSortedData(sortedData.sort(function(a, b){
          const nameA = a.sellDay;
          const nameB = b.sellDay;
          if(nameA < nameB) { return -1; }
          if(nameA > nameB) { return 1; }
          return 0;
        }));
      }
    } else if (value === 'buyPrice' ) {
      // 매수 가격
      if(!status){
        fireDb.child('stock').orderByChild(`${e.target.value}`).on('value', (snapshot) => {
          let sortedData = [];
          snapshot.forEach((snap)=>{
            sortedData.push(snap.val());
          });
          setSortedData(sortedData.sort((a,b)=>
            Number(b.buyPrice)-Number(a.buyPrice)
          ));
        })
      } else {
        let sortedData = [];
        Object.keys(data).forEach(function(v){
          sortedData.push(data[v])
        });
        setSortedData(sortedData.sort((a,b)=>
        Number(b.buyPrice)-Number(a.buyPrice)
      ));
      }
    } else if (value === 'sellPrice') {
      // 매도 가격
      if(!status){
        fireDb.child('stock').orderByChild(`${e.target.value}`).on('value', (snapshot) => {
          let sortedData = [];
          snapshot.forEach((snap)=>{
            sortedData.push(snap.val());
          });
          setSortedData(sortedData.sort((a,b)=>
            Number(b.sellPrice)-Number(a.sellPrice)
          ));
        })
      } else {
        let sortedData = [];
        Object.keys(data).forEach(function(v){
          sortedData.push(data[v])
        });
        setSortedData(sortedData.sort((a,b)=>
        Number(b.sellPrice)-Number(a.sellPrice)
      ));
      }
    } else if (value === 'prepare') {
      // 대비
      if(!status){
        fireDb.child('stock').on('value', (snapshot) => {
          let sortedData = [];
          snapshot.forEach((snap)=>{
            sortedData.push(snap.val());
          });
          setSortedData(sortedData.sort((a,b)=>
            ((Number(b.sellPrice)-Number(b.buyPrice))-(Number(a.sellPrice)-Number(a.buyPrice)))
          ))
        });
      } else {
        let sortedData = [];
        Object.keys(data).forEach(function(v){
          sortedData.push(data[v])
        });
        setSortedData(sortedData.sort((a,b)=>
        ((Number(b.sellPrice)-Number(b.buyPrice))-(Number(a.sellPrice)-Number(a.buyPrice)))
      ))
      }
    } else if (value === 'fluctuationRate') {
      // 등락률
      if(!status){
        fireDb.child('stock').on('value', (snapshot) => {
          let sortedData = [];
          console.log(snapshot)
          snapshot.forEach((snap)=>{
            sortedData.push(snap.val());
          });
          setSortedData(sortedData.sort((a,b)=>
            (((Number(b.sellPrice)-Number(b.buyPrice))/Number(b.buyPrice))*100) - (((Number(a.sellPrice)-Number(a.buyPrice))/Number(a.buyPrice))*100)
          ))
        });
      } else {
        let sortedData = [];
        Object.keys(data).forEach(function(v){
          sortedData.push(data[v])
        });
        setSortedData(sortedData.sort((a,b)=>
        (((Number(b.sellPrice)-Number(b.buyPrice))/Number(b.buyPrice))*100) - (((Number(a.sellPrice)-Number(a.buyPrice))/Number(a.buyPrice))*100)
      ))
      }
    } else if (value === 'investmentPeriod'){
      // 투자 기간
      if(!status){
        fireDb.child('stock').on('value', (snapshot) => {
          let sortedData = [];
          snapshot.forEach((snap)=>{
            sortedData.push(snap.val());
          });
          setSortedData(sortedData.sort((a,b)=>
          (Math.floor(new Date(a.sellDay).getTime() - new Date(a.buyDay).getTime())/(1000 * 60 * 60 *24))-(Math.floor(new Date(b.sellDay).getTime() - new Date(b.buyDay).getTime())/(1000 * 60 * 60 *24))
          ))
        });
      } else {
        let sortedData = [];
        Object.keys(data).forEach(function(v){
          sortedData.push(data[v])
        });
        setSortedData(sortedData.sort((a,b)=>
        (Math.floor(new Date(a.sellDay).getTime() - new Date(a.buyDay).getTime())/(1000 * 60 * 60 *24))-(Math.floor(new Date(b.sellDay).getTime() - new Date(b.buyDay).getTime())/(1000 * 60 * 60 *24))
        ))
      }
    } else {
      handleReset()
    } 
  };

  const handleReset = (e) => {
    setSort(false);
    fireDb.child('stock').on('value', (snapshot) => {
      if(snapshot.val() !== null) {
        setData({...snapshot.val()});
      } else {
        setData({});
      }
    })
    // document.getElementById('select').value='none';
    selectRef.current.value = 'none';
  }

  const filterData = (value) => {
    handleReset();
    fireDb.child('stock').orderByChild('status').equalTo(value).on('value',(snapshot)=> {
      if(snapshot.val()){
        const data = snapshot.val();
        setData(data);
        console.log(data)
        setStatus(true)
        
      }
    });
  }

  const handleAuth = () => {
    if(currentUser) {
      dispatch(logoutInitiate());
    }
  };

  return currentUser ? (
    <div style={{marginTop: '50px'}}>
      <h2>관심 종목</h2>
      <label>상태 : </label>
      <button className="btn btn-active" onClick={()=> filterData('관심 종목')}>관심 종목</button>
      <button className="btn btn-inactive" onClick={()=> filterData('매수 종목')}>매수 종목</button>
      <button className="btn btn-outactive" onClick={()=> filterData('매도 종목')}>매도 종목</button>
      <label>정렬 기준: </label>
      <select id="select" ref={selectRef} className="dropdown" name="colValue" style={{marginBottom: '20px'}} onChange={handleChange}>
        <option value='none'>선택 해주세요</option>
        <option value="itemName">종목 명</option>
        <option value="buyDay">매수 날짜</option>
        <option value="buyPrice">매수 가격</option>
        <option value="sellDay">매도 날짜</option>
        <option value="sellPrice">매도 가격</option>
        <option value="prepare">대비</option>
        <option value="fluctuationRate">등락률</option>
        <option value="investmentPeriod">투자기간</option>
      </select >
      <button className="btn btn-reset" onClick={handleReset}>초기화</button>
      <table className="styled-table">
        <thead>
          <tr>
            {/* <th style={{ textAlign: 'center' }}>No.</th> */}
            <th style={{ textAlign: 'center', width: '90px' }}>종목 명</th>
            <th style={{ textAlign: 'center', width: '100px' }}>매수 날짜</th>
            <th style={{ textAlign: 'center', width: '80px' }}>매수 가격</th>
            <th style={{ textAlign: 'center', width: '100px' }}>매도 날짜</th>
            <th style={{ textAlign: 'center', width: '80px' }}>매도 가격</th>
            <th style={{ textAlign: 'center', width: '80px' }}>대비</th>
            <th style={{ textAlign: 'center', width: '80px' }}>등락률</th>
            <th style={{ textAlign: 'center', width: '100px' }}>투자 기간</th>
            <th style={{ textAlign: 'center', width: '80px' }}>상태</th>
            {!sort && (<th style={{ textAlign: 'center', width: '250px' }}>기능</th>)}
          </tr>
        </thead>
        {!sort && (
          <tbody>
          {Object.keys(data).map((id, index)=>{
            if(data[id].uid === uid){
              return (
                <tr key={id}>
                  {/* <th scope="row" >{index + 1}</th> */}
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
                      (data[id].sellPrice - data[id].buyPrice ) > 0 ? `▲${(((data[id].sellPrice - data[id].buyPrice) / data[id].buyPrice) * 100).toFixed(2)} % ` 
                    // 매도가 + 이면
                      :`▽${(((data[id].sellPrice - data[id].buyPrice) / data[id].buyPrice) * 100).toFixed(2)} % `
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
                          `${Math.floor(new Date(data[id].sellDay).getTime() - new Date(data[id].buyDay).getTime())/(1000 * 60 * 60 * 24) } D`
                          : 
                          `${
                            Math.floor(new Date(data[id].sellDay).getFullYear() - new Date(data[id].buyDay).getFullYear())}Y
                            
                           ${
                            new Date(data[id].sellDay).getMonth() < new Date(data[id].buyDay).getMonth() 
                            ?
                            Math.floor(new Date(data[id].sellDay).getMonth() - new Date(data[id].buyDay).getMonth() ) + 12 
                            :
                            Math.floor(new Date(data[id].sellDay).getMonth() - new Date(data[id].buyDay).getMonth())}M
  
                            ${
                              new Date(data[id].sellDay).getDate() < new Date(data[id].buyDay).getDate() 
                              ?
                              Math.floor(new Date(data[id].sellDay).getDate() - new Date(data[id].buyDay).getDate() ) + 30 
                              :
                              Math.floor(new Date(data[id].sellDay).getDate() - new Date(data[id].buyDay).getDate())}D
                          `
                          // `${((Math.floor(new Date(data[id].sellDay).getTime() - new Date(data[id].buyDay).getTime())/(1000 * 60 * 60 * 24))/365).toFixed()}년`
  
                    } 
                  </td>
                  {/* 투자 기간 */}
  
                  <td>
                    {data[id].status}
                  </td>
  
                  <td>
                    <Link to={`/update/${id}`}>
                      <button className="btn btn-edit">수정</button>
                    </Link>
                      <button className="btn btn-delete" onClick={() => onDelete(id)}>삭제</button>
                    <Link to={`/view/${id}`}>
                      <button className="btn btn-view">상세</button>
                    </Link>
                  </td>
                </tr>
              )
            }

            


          })}
        </tbody>
        )}



        {sort && (
          <tbody>
            {sortedData.map((item, index) => {
              if(item.uid === uid) {
                return(
                  <tr key={index}>
                  {/* <th scope="row" >{index + 1}</th> */}
                  <td>
                    <Link 
                      style={{ 
                        textDecoration: 'none', 
                        color: 'black', 
                      }} 
                      to={`/view/${item}`}>{item.itemName}
                    </Link>
                  </td>
                  
                  {/* 종목 명 */}
  
                  <td>{item.buyDay}</td>
                  {/* 매수 날짜 */}
  
                  <td>{item.buyPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                  {/* 매수 금액 */}
  
                  <td>{item.sellDay ? item.sellDay : (null)}</td>
                  {/* 매도 날짜 */}
  
                  <td>{item.sellPrice ? item.sellPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') :' '}</td>
                  {/* 매도 금액 */}
  
                  <td>
                    {!(item.sellPrice) ? (null) : 
                    // 매도 가격이 없으면 공백
                  (item.sellPrice - item.buyPrice ) > 0 ? ` ▲ ${(item.sellPrice - item.buyPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} `
                    // 대비가 + 이면
                  : `▽ ${(item.sellPrice - item.buyPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    // 대비가 - 이면
                  }
                  </td>
                  {/* 대비 */}
  
                  <td>
                    {!(item.sellPrice) ? (null) :
                    // 매도 가격이 없으면 공백
                      (item.sellPrice - item.buyPrice ) > 0 ? `▲${(((item.sellPrice - item.buyPrice) / item.buyPrice) * 100).toFixed(2)} % ` 
                    // 매도가 + 이면
                      :`▽${(((item.sellPrice - item.buyPrice) / item.buyPrice) * 100).toFixed(2)} % `
                    // 매도가 - 이면
                    }
                  </td>
                  {/* 등락률 */}
  
                  <td>
                    {
                      !(item.sellDay) ? 
                        (null)
                          :
                        Math.floor(new Date(item.sellDay).getTime() - new Date(item.buyDay).getTime())/(1000 * 60 * 60 * 24) < 365
                          ? 
                        //  ('365일 이하인 경우')
                        `${Math.floor(new Date(item.sellDay).getTime() - new Date(item.buyDay).getTime())/(1000 * 60 * 60 * 24) } D`
                        : 
                        `${
                          Math.floor(new Date(item.sellDay).getFullYear() - new Date(item.buyDay).getFullYear())}Y
                         ${
                          new Date(item.sellDay).getMonth() < new Date(item.buyDay).getMonth() 
                          ?
                          Math.floor(new Date(item.sellDay).getMonth() - new Date(item.buyDay).getMonth() ) + 12 
                          :
                          Math.floor(new Date(item.sellDay).getMonth() - new Date(item.buyDay).getMonth())}M
                          ${
                            new Date(item.sellDay).getDate() < new Date(item.buyDay).getDate() 
                            ?
                            Math.floor(new Date(item.sellDay).getDate() - new Date(item.buyDay).getDate() ) + 30 
                            :
                            Math.floor(new Date(item.sellDay).getDate() - new Date(item.buyDay).getDate())}D
                        `
                      // `${((Math.floor(new Date(data[id].sellDay).getTime() - new Date(data[id].buyDay).getTime())/(1000 * 60 * 60 * 24))/365).toFixed()}년`
                    } 
                  </td>
                  {/* 투자 기간 */}
                  <td>{item.status}</td>
                </tr>
                )
              }
            })}
          </tbody>
        )}
        
      </table>
      <button className="btn btn-reset" onClick={handleAuth} style={{marginTop: '20px', background: 'red'}}>로그아웃</button>

    </div>
  ) : <Login/>
}

export default Home
