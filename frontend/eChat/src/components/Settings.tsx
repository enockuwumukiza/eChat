import React, { useState,useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Grid,
} from '@mui/material';
import {  
  Save as SaveIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';




import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useUpdateUserProfileMutation } from '../store/slices/usersApiSlice';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string(),
  status: yup.string(),
  email: yup.string().email('Invalid email format'),
  phone: yup.string(),
  profilePicture: yup.mixed(),
});

const Settings: React.FC = () => {



    const { authUser, login } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      status: authUser?.user?.status || '',
      phone: authUser?.user?.phone || '',
      name: authUser?.user?.name || '',
      email: authUser?.user?.email || '',
      profilePicture: '',
    },
    resolver: yupResolver(schema),
  });
    



  const [open, setOpen] = useState<boolean>(false);
      

    const isSettingsShown = useSelector((state: RootState) => state.display.isSettingsShown);

    const [ updateUserProfile] = useUpdateUserProfileMutation();
    
    
  

  const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    

    useEffect(() => {
        if (isSettingsShown) {
            handleOpen();
        }
    }, [isSettingsShown]);

   

  const onSubmit = async (data: any) => {

    const formData: FormData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);

    
    if (data?.profilePicture?.[0]) {
      
        formData.append('photo', data.profilePicture[0]);
    }

  try {
    
    const response = await updateUserProfile(formData).unwrap();
    login(response);
    console.log('response: ', response);
    toast.success('Profile updated successfully');
    setOpen(false);

    

  } catch (error: any) {
    toast.error(error?.data?.message || error?.message || 'Error saving settings');
  }
};

    
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>

        <Box
          sx={{
            position: 'absolute',
              top: "50%",
            color:'white',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: {
                xs: "100%",
                sm: "100%",
                md: "100%",
                lg: "60%",
            },
            maxHeight:"90vh",
            overflowY:"auto"
            
                  }}
                  
        >
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h6" component="h2">
              Settings
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

                  <Divider className="mb-4" />
                  
         


          {/* Profile Settings */}
                  <div style={{
                      margin: "20px 0px",
                      
        }}>
                      <Typography variant="body1" className="font-semibold text-gray-700" style={{
                          marginBottom: "15px",
                          fontWeight:"bold"
            }}>
            Profile Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Status"
                {
                    ...register('status')
                }
              />
            </Grid>
        </Grid>
                      

        
               {/* Profile Picture Upload */}
        <Typography variant="body1" className="mb-4 font-semibold text-gray-700">
        Profile Picture
              </Typography>
              
              <div className='form-control'>
                <input type="file" accept='image/*' {...register('profilePicture')} />
            </div>

        

        <Divider className="my-4" />
          </div>

          <Divider className="my-4" />

                  <div style={{
                    margin:"20px 0px"
          }}>
                      {/* Privacy Settings */}
                      <Typography variant="body1" className="font-semibold text-gray-700" style={{
                          marginBottom: "15px",
                          fontWeight:"bold"
          }}>
            Privacy Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="name"
                {...register("name")}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                {...register('email')}
                variant="outlined"
              />
            </Grid>
          </Grid>
          </div>

          <Divider className="my-4" />

          {/* Mobile Number */}
                  <div style={{
                    margin:"20px 0px"
          }}>
        
          <TextField
            fullWidth
            type="tel"
            label="Mobile Number"
            {...register('phone')}
            variant="outlined"
            className="mb-4"
          />
          </div>
          <Divider className="my-4" />

          <div className="flex justify-end mt-6">
            <Button variant="contained" color="primary" startIcon={<SaveIcon />} type='submit' disabled={isSubmitting}>
                {
                 isSubmitting ? "Saving settings...":"Save Settings"        
              }
            </Button>
          </div>
        </Box>
                  {
                      errors?.root && <p className='text-red-500'>{ errors?.root?.message}</p>
            }
        </form>
      </Modal>
    </div>
  );
};

export default Settings;



