import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, Link} from 'react-router-dom';
import { loginInitiate } from '../redux/actions';

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
  })

  const {email, password} = state;

  const {currentUser} = useSelector((state) => state.user);

  const navigate  = useNavigate();

  useEffect(()=>{
    if(currentUser) {
      navigate('/');
    }
  },[currentUser, navigate ]);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!email || !password) {
      return;
    }
    dispatch(loginInitiate(email, password));
    setState({email: '', password: ''});
  }

  const handleChange = (e) => {
    let {name, value} = e.target;
    setState({...state, [name]: value});
  }

  return (
    <div>
      <h2>장기 주식 투자 데이터 창고</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor=''>이메일</label>
        <input 
          type='email' 
          id='inputEmail' 
          name='email' 
          placeholder='test@test.test'
          onChange={handleChange} 
          value={email} 
          required />
        <br/>
        <label htmlFor=''>비밀번호</label>
        <input 
          type='password' 
          id='inputPassword' 
          name='password' 
          placeholder='testtest' 
          onChange={handleChange} 
          value={password} 
          required
        />
        <input type="submit" value={ "로그인" } />
        <hr/>
        <p>계정이 없으시면 회원가입을 진행 하세요.</p>
        <Link to={ "/register"}>
          <button type='button' id="btn-signup">
            회원가입
          </button>
        </Link>
        
      </form>  
    </div>
  )
}

export default Login
