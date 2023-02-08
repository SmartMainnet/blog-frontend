import React from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import styles from './Login.module.scss'
import axios from '../../axios'
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth'

export const Registration = () => {
  const [avatarUrl, setAvatarUrl] = React.useState()

  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const inputFileRef = React.useRef(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'all',
  })

  const handleChangeFile = async event => {
    try {
      const file = event.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      const { data } = await axios.post('/uploads', formData)
      setAvatarUrl(data.url)
    } catch (err) {
      alert('Ошибка при загрузке файла')
    }
  }

  const onSubmit = async values => {
    const data = await dispatch(fetchRegister({ ...values, avatarUrl }))

    if (!data.payload) {
      alert('Не удалось зарегистрироваться!')
    }

    if (data.payload.token) {
      localStorage.setItem('token', data.payload.token)
    } else {
      alert('Не удалось зарегистрироваться!')
    }
  }

  if (isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Создание аккаунта
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar}>
          <Avatar
            className={styles.image}
            onClick={() => inputFileRef.current.click()}
            src={avatarUrl ? process.env.REACT_APP_API_URL + avatarUrl : ''}
            sx={{ width: 100, height: 100 }}
          />
        </div>
        <input ref={inputFileRef} onChange={handleChangeFile} type='file' hidden />
        <TextField
          className={styles.field}
          label='Полное имя'
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          type='fullName'
          {...register('fullName', { required: 'Укажите полное имя' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label='E-Mail'
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type='email'
          {...register('email', { required: 'Укажите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label='Пароль'
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
          fullWidth
        />
        <Button disabled={!isValid} type='submit' size='large' variant='contained' fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  )
}
