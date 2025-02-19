import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useRegisterUserMutation } from '../store/slices/usersApiSlice'
import PhoneNumberInput from '../utils/PhoneInput'

const schema  = yup.object().shape({
    name: yup.string().required('name is required'),
    email: yup.string().required('email is required').email('Invalid email format'),
    phone: yup.string().required('phone number is required'),
    password: yup.string().required('password is required').min(8, 'password must at least be 8 characters long'),
    profilePicture: yup.mixed()
});

const SignupPage: React.FC = () => {

    const { login } = useAuth();
    const [ registerUser, ] = useRegisterUserMutation();

    const navigate = useNavigate();
    const { register, handleSubmit,control, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema)
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);


    const onSubmit = async (data: any) => {

        const formData: FormData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('phone', data.phone);

        if (data?.profilePicture?.[0]) {
            formData.append('photo', data.profilePicture[0]);
        }
        
        try {

            const response = await registerUser(formData).unwrap();
            login(response);
            toast.success('signup successful');
            navigate('/');

        } catch (error: any) {
            console.error(`signup failed: ${error?.data}`);
            toast.error(error?.data?.message || error?.message || 'error signing up');
        }
    }

  return (
      <div className='flex items-center justify-center flex-col'>
          <h1 className='font-bold text-3xl text-center mb-5'>Welcome!</h1>
          <div className='flex flex-col gap-2 p-5 space-y-2 bg-sky-950 w-full sm:w-[80%] md:w-[60%] lg:w-[40%] rounded-lg shadow-lg'>
              <form className='space-y-2 mb-4' onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-control'>
                      <label className='label'>
                          <span className='label-text font-semibold text-xl text-white'>Name</span>
                      </label>
                      <input type="text"
                          {...register('name')}
                          className={`input input-bordered font-semibold ${ errors.name && 'input-error'}`}
                      />
                      {
                          errors.name && <span className='text-red-500'>{errors.name.message }</span>
                    }
                  </div>
                  <div className='form-control'>
                      <label className='label'>
                          <span className='label-text font-semibold text-xl text-white'>Email</span>
                      </label>
                      <input type="text"
                          {...register('email')}
                          className={`input input-bordered font-semibold ${ errors.email && 'input-error'}`}
                      />
                      {
                          errors.email && <span className='text-red-500'>{errors.email.message }</span>
                    }
                  </div>
                  <div className='form-control relative'>
                      <label className='label'>
                          <span className=' label-text font-semibold text-xl text-white'>Phone</span>
                      </label>
                      <Controller
                          
                          
                          name='phone'
                          control={control}

                          render={({ field }) => (
                              <PhoneNumberInput {...field} />
                          )}
                      />
                      {
                          errors.phone && <span className='text-red-500'>{errors.phone.message }</span>
                    }
                  </div>
                  <div className='form-control relative'>
                      <label className='label'>
                          <span className='label-text font-semibold text-xl text-white'>Password</span>
                      </label>
                      <input type={`${showPassword ? 'text':'password'}`}
                          {...register('password')}
                          className={`input input-bordered font-semibold ${ errors.password && 'input-error'}`}
                      />
                      <IconButton className=""
                      
                          sx={{
                              position: 'absolute',
                              right: '0%',
                              bottom:'0%'
                          }}
                          onClick={() => setShowPassword(!showPassword)}>
                          {
                              showPassword ? <VisibilityOff htmlColor='blue'/> : <Visibility htmlColor='blue'/>
                          }
                      </IconButton>
                      {
                          errors.password && <span className='text-red-500'>{errors.password.message }</span>
                    }
                  </div>
                  <div className='form-control'>
                      <label className='label'>
                          <span className='label-text font-semibold text-xl text-white'>Photo</span>
                      </label>
                      <input type='file'
                            accept='image/*'
                          {...register('profilePicture')}
                          className={`file file-input file-input-bordered font-semibold ${ errors.profilePicture && 'input-error'}`}
                      />
                      
                  </div>
                  <button
                      disabled={isSubmitting}
                      type='submit' className={`btn btn-${isSubmitting ? 'secondary' :'primary'} w-full font-bold`} >
                      {
                          isSubmitting ? <span className='loading loading-bars loading-lg text-white'></span> : 'Signup'
                      }
                      </button>
                  {
                      errors.root && <span className='text-red-500'>{ errors?.root.message }</span>
                  }

              </form>
              <div className='flex items-center justify-center gap-5'>
                  <p className='text-lg font-serif text-white'>Already have an account ?</p>
                  <div>
                      <Link to={'/login'}>
                          <button className='btn btn-secondary font-medium'>Login</button>
                      </Link>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default SignupPage
