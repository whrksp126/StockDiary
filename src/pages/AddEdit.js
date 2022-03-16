import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './AddEdit.css';
import fireDb from '../firebase';
import {toast} from 'react-toastify';
import { getAuth } from "firebase/auth";



const AddEdit = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;
  const initialState = {
    itemName: '',
    buyDay: '',
    buyPrice: '',
    status: '',
    uid: uid,
  }  
  

  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});

  const {itemName, buyDay, buyPrice, sellDay, sellPrice, status} = state;

  const navigate = useNavigate();

  const {id} = useParams()


  useEffect(() => {

    fireDb.child('stock').on('value', (snapshot) => {
      if(snapshot.val() !== null){
        setData({...snapshot.val()})
      } else {
        setData({})
      }
    });

    return () => {
      setData({});
    };
  }, [id])
  
  // 수정 기능 부여
  useEffect(()=>{
    if(id) {
      setState({...data[id]})
    } else {
      setState({...initialState})
    }

    return ()=>{
      setState({...initialState})
    }
  }, [id,data])

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!id){
      if(!itemName || !buyDay || !buyPrice || !status) {
        toast.error('종목 명, 매수 일, 매수 금액은 필수 입력 사항입니다.')
      } else {
        fireDb.child('stock').push(state, (err) => {
          if(err) {
            toast.error(err);
          } else {
            toast.success('종목 추가 성공')
          }
        })
        setTimeout(()=>navigate('/', 500))
      }
    } else {
      // id가 있는 경우
      if (!data[id].sellDay || !data[id].sellPrice) {
        // 저장된 매도 일, 매도 금액이 하나라도 없는 경우

        if(!sellPrice || !sellDay){
          // 새로 입력 된 매도 금액, 매도 일 중 하나라도 없는 경우
          console.log(sellPrice)
          console.log(sellDay)
          if(!sellPrice && sellDay){
            toast.error('매도 금액을 입력해 주세요')
          } else if (sellPrice && ! sellDay){
            toast.error('매도 일을 입력해 주세요')
          } else if ((data[id].itemName !== itemName) || (data[id].buyDay !== buyDay) || (data[id].buyPrice !== buyPrice) || (data[id].status !== status) ) {
            // 기존의 종목 명, 매수 일, 매수 금액과 새로 입력된 정보가 다른 경우
            fireDb.child(`stock/${id}`).set(state, (err) => {
              if(err) {
                toast.error(err);
              } else {
                toast.success('종목 기본 정보를 수정하였습니다.')
              }
            });
            setTimeout(()=>navigate('/'), 500);
          } else {
            toast.error('변경된 정보가 없습니다.')
          }
        } else {
          // 새로 입력 된 매도 금액, 매도 일 둘 다 있을 경우
          fireDb.child(`stock/${id}`).set(state, (err) => {
            if(err) {
              toast.error(err);
            } else {
              toast.success('매도 정보를 추가 하셨습니다.')
            }
          });
          setTimeout(()=>navigate('/'), 500);
        } 
      } else {
        // 저장된 매도 일, 매도 금액이 모두 있는 경우
        if((data[id].itemName !== itemName) || (data[id].buyDay !== buyDay) || (data[id].buyPrice !== buyPrice) || (data[id].sellDay !== sellDay) || (data[id].sellPrice !== sellPrice)){
          // 기존의 종목 명, 매수 일, 매수 금액, 매도 일, 매도 금액과 새로 입력 된 정보가 다른 경우
          console.log('기존의 정보와 달라요')
          if(!itemName || !buyPrice || !buyDay) {
            console.log('필수 사항이 입력되지 않앗습니다.')
            toast.error('종목 명, 매수 일, 매수 금액은 필수 입력 사항입니다.')
          } else {          
            if (!sellDay && !sellPrice) {
              // 변경 된 내용에서 매수 일, 매수 금액 데이터가 하나라도 없어진 경우
              console.log('매도 정보가 없어졌어요')
              fireDb.child(`stock/${id}`).set(state, (err) => {
                if(err) {
                  toast.error(err);
                } else {
                  toast.success('매도를 취소 하셨습니다.')
                }
              });
              setTimeout(()=>navigate('/'), 500);
            } else if (!sellPrice || !sellDay) {
              console.log('매수 정보가 없어요')
              if(!sellPrice && sellDay){
                toast.error('매도 금액을 입력해 주세요')
              } else if (sellPrice && ! sellDay){
                toast.error('매도 일을 입력해 주세요')
              }
            } else {
              // 데이터가 다 있고 값이 변경되엇을 떄
              fireDb.child(`stock/${id}`).set(state, (err) => {
                if(err) {
                  toast.error(err);
                } else {
                  toast.success('종목 정보를 수정 하셨습니다.')
                }
              });
              setTimeout(()=>navigate('/'), 500);
            }
          }
        } else {
          toast.error('변경된 정보가 없습니다.')
        }
      }
    }
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if(!itemName || !buyDay || !buyPrice) {
  //     toast.error('각 입력 필드에 값을 입력하세요.')
  //   } else {
  //     if(!id){
  //       fireDb.child('stock').push(state, (err) => {
  //         if(err) {
  //           toast.error(err);
  //         } else {
  //           toast.success('종목 추가 성공')
  //         }
  //       });
  //     } else {
  //         fireDb.child(`stock/${id}`).set(state, (err) => {
  //           if(err) {
  //             toast.error(err);
  //           } else {
  //             toast.success('종목 수정 성공')
  //           }
  //         });
        
  //     }
  //     setTimeout(()=>navigate('/'), 500);
  //   }
  // }
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setState({...state, [name]: value});
  }

  return (
    <div style={{marginTop: '100px'}}>
      <h2>종목 추가 페이지</h2>
      <form onSubmit={handleSubmit} style={{margin: 'auto', padding: '15px', maxWidth: '400px', alignItems: 'center'}} >
        <label htmlFor='itemName'>종목 명  {id && `(☆)`}</label>
        <input value={itemName || ""} onChange={handleInputChange} type='text' id='itemName' name='itemName' placeholder='삼성전자' />

        <label htmlFor='buyDay'>매수 일 {id && `(☆)`}</label>
        <input value={buyDay ||""}onChange={handleInputChange} type='date' id='buyDay' name='buyDay'/>

        <label htmlFor='buyPrice' >매수 금액 {id && `(☆)`}</label>
        <input value={buyPrice || ""} onChange={handleInputChange} type='number' id='buyPrice' name='buyPrice' placeholder='10000' />

        {id && <label htmlFor='sellDay'>매도 일</label>}
        
        {id && <input value={sellDay ||""}onChange={handleInputChange} type='date' id='sellDay' name='sellDay'/> }

        {id && <label htmlFor='buyPrice' >매도 금액</label> }
        {id && <input value={sellPrice || ""} onChange={handleInputChange} type='number' id='sellPrice' name='sellPrice' placeholder='20000' /> }

        <label htmlFor='status'>관심  {id && `(☆)`}</label>
        <input value={status || ""} onChange={handleInputChange} type='text' id='status' name='status' placeholder='관심 종목, 매수 종목, 매도 종목, ' />

        <input type="submit" value={id ? "수정" : "저장" } />
      </form>
    </div>
  )
}

export default AddEdit