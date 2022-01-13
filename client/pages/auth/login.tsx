import {useForm} from 'react-hook-form';
import {useRouter} from 'next/router'
import {zodResolver} from '@hookform/resolvers/zod'
import { object, string, TypeOf } from 'zod';
import axios from 'axios'
import {useState} from 'react'

const createSessionSchema = object({
  email: string().nonempty({
    message: "Email is required",
  }),
  password: string().nonempty({
    message: "Password is required",
  }),
});


type CreateUserInput = TypeOf<typeof createSessionSchema>;

function LoginPage(){
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);
  const {
    register,
    formState: { errors }, 
    handleSubmit
  } = useForm<CreateUserInput>({resolver:zodResolver(createSessionSchema)})
  async function onSubmit(values: CreateUserInput){
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
      values,
      {withCredentials: true});
      router.push("/")
    } catch (error: any) {
      setLoginError(error.message);
    }
  }
  return (
  <>
    <p>{loginError}</p>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='form-element'>
        <label htmlFor='email'>Email</label>
        <input 
          type="email" 
          id="email" 
          placeholder='example@gmail.com'
          {...register("email")}
          />
          <p>{errors.email?.message}</p>
      </div>
      <div className='form-element'>
        <label htmlFor='password'>Password</label>
        <input 
          type="password" 
          id="password" 
          placeholder='your password'
          {...register("password")}
          />
          <p>{errors.password?.message}</p>
      </div>
      <button type='submit'>Submit</button>
    </form>
  </>);
}

export default LoginPage;