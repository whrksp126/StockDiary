import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, Link} from 'react-router-dom';
import { registerInitiate } from '../redux/actions';

const Register = () => {

  const [state, setState] = useState({
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const {currentUser} = useSelector((state) => state.user);

  const navigate  = useNavigate();

  useEffect(()=>{
    if(currentUser) {
      navigate('/');
    }
  },[currentUser, navigate ]);

  const dispatch = useDispatch();

  const {email, password, passwordConfirm, displayName} = state;
  const handleSubmit = (e) => {
    e.preventDefault();
    if(password !== passwordConfirm) {
      return;
    }
    dispatch(registerInitiate(email, password, displayName));
    setState({email: '', displayName: '', password: '', passwordConfirm: ''});
  }

  const handleChange = (e) => {
    let {name, value} = e.target;
    setState({...state, [name]: value});
  }

  return (
    <div>
      <h2>회원가입 페이지 입니다.</h2>
      <form onSubmit={handleSubmit}>
      <label htmlFor=''>성명</label>
        <input 
          type='text' 
          id='displayName' 
          name='displayName' 
          placeholder='test'
          onChange={handleChange} 
          value={displayName} 
          required />
        <br/>
        <label htmlFor=''>이메일</label>
        <input 
          type='email' 
          id='user-email' 
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
        <label htmlFor=''>비밀번호 재확인</label>
        <input 
          type='password' 
          id='passwordConfirm' 
          name='passwordConfirm' 
          placeholder='testtest' 
          onChange={handleChange} 
          value={passwordConfirm} 
          required
        />
        <input type="submit" value={ "로그인" } />
        <Link to="/login">
          <button>돌아가기</button>
        </Link>
      </form>  
    </div>
  )
}

export default Register
