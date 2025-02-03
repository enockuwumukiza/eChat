import React from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLoginUserMutation } from '../store/slices/usersApiSlice'
import Loader from '../utils/Loader'

const schema = yup.object().shape({
    email: yup.string().required('email is required').email('Invalid email format'),
    password: yup.string().required('password is required').min(8, 'password must at least be 8 characters long')
});

const LoginPage: React.FC = () => {
    
    const { login } = useAuth();
    const [ loginUser, { isLoading }] = useLoginUserMutation();

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema)
    });


    const onSubmit = async (data: any) => {
 
        try {
            const response = await loginUser({email: data?.email, password: data?.password }).unwrap();
            login(response);
            toast.success('login successful');
            navigate('/');

        } catch (error: any) {
            console.error(`login failed: ${error?.data}`);
            toast.error(error?.data?.message || error?.message || 'error loging in');
        }
    }

    if (isLoading) {
        return <Loader/>
    }

  return (
      <div className='flex items-center justify-center flex-col h-screen px-4 sm:px-6 md:px-8'>
          <h1 className='font-bold text-xl md:text-3xl lg:text-4xl text-center mb-5'>Welcome Back!</h1>
          <div className='flex flex-col gap-2 p-5 space-y-2 bg-sky-950 w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[40%] rounded-lg shadow-lg'>
              <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-control'>
                      <label className='label'>
                          <span className='label-text font-semibold text-xl'>Email</span>
                      </label>
                      <input type="email"
                          {...register('email')}
                          className={`input input-bordered font-semibold ${ errors.email && 'input-error'}`}
                      />
                      {
                          errors.email && <span className='text-red-500'>{errors.email.message }</span>
                    }
                  </div>
                  <div className='form-control'>
                      <label className='label'>
                          <span className='label-text font-semibold text-xl'>Password</span>
                      </label>
                      <input type={`password`}
                          {...register('password')}
                          className={`input input-bordered font-semibold ${ errors.password && 'input-error'}`}
                      />
                      {
                          errors.password && <span className='text-red-500'>{errors.password.message }</span>
                    }
                  </div>        
                  <button
                      disabled={isSubmitting}
                      type='submit' className={`btn btn-${isSubmitting ? 'secondary' :'primary'} w-full font-bold`} >
                      {
                          isSubmitting ? <span className='loading loading-bars loading-lg'></span> : 'Login'
                      }
                      </button>
                  {
                      errors.root && <span className='text-red-500'>{ errors?.root.message }</span>
                  }

              </form>
              <div className='flex items-center justify-center gap-5'>
                  <p className='text-lg font-serif'>No account ?</p>
                  <div>
                      <Link to={'/signup'}>
                          <button className='btn btn-secondary font-medium'>Signup</button>
                      </Link>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default LoginPage
