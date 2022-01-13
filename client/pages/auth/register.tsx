import {useForm} from 'react-hook-form';
import {useRouter} from 'next/router'
import {zodResolver} from '@hookform/resolvers/zod'
import { object, string, TypeOf } from 'zod';
import axios from 'axios'
import {useState} from 'react'
import getGoogleOauthUrl from '../../utils/getGoogleOauthUrl';
const createUserSchema = object({
  name: string().nonempty({
    message: "Name is required",
  }),
  password: string().min(6, "Password too short - should be 6 chars minimum")
  .nonempty({
    message: "Password is required",
  }),
  passwordConfirmation: string().nonempty({
    message: "Password Confirmation is required",
  }),
  email: string().email("Not a valid email").nonempty({
    message: "Email is required",
  }),
}).refine((data: any) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

function RegisterPage(){
  const router = useRouter();
  const [registerError, setRegisterError] = useState(null);
  const {
    register,
    formState: { errors }, 
    handleSubmit
  } = useForm<CreateUserInput>({resolver:zodResolver(createUserSchema)})
  async function onSubmit(values: CreateUserInput){
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`, values);
      router.push("/")
    } catch (error: any) {
      console.log(error)
      setRegisterError(error.message);
    }
  }
  return (
  <>
    <p>{registerError}</p>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='form-element'>
        <label htmlFor='name'>Name</label>
        <input 
          type="text" 
          id="name" 
          placeholder='name here ...'
          {...register("name")}
          />
          <p>{errors.name?.message}</p>
      </div>
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
      <div className='form-element'>
        <label htmlFor='confirmpassword'>Confirm Password</label>
        <input 
          type="password" 
          id="confirmpassword" 
          placeholder='your pass word again'
          {...register("passwordConfirmation")}
          />
          <p>{errors.passwordConfirmation?.message}</p>
      </div>
      <button type='submit'>Submit</button>
      
    </form>
  </>);
}

export default RegisterPage;