import React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Paper, TextField } from '@mui/material'
import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import axios from '../../axios'
import { selectIsAuth } from '../../redux/slices/auth'

export const AddPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const inputFileRef = React.useRef(null)

  const [text, setText] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')

  const isEditing = Boolean(id)

  const handleChangeFile = async event => {
    try {
      const file = event.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      const { data } = await axios.post('/uploads', formData)
      setImageUrl(data.url)
    } catch (err) {
      alert('Ошибка при загрузке файла')
    }
  }

  const onClickRemoveImage = () => {
    setImageUrl('')
  }

  const onChange = React.useCallback(text => {
    setText(text)
  }, [])

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        tags: tags.split(',').map(tag => tag.trim()),
        imageUrl,
        text,
      }

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)

      const _id = isEditing ? id : data._id

      navigate(`/posts/${_id}`)
    } catch (err) {
      alert('Ошибка при создании статьи')
    }
  }

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title)
          setTags(data.tags.join(', '))
          setText(data.text)
          setImageUrl(data.imageUrl)
        })
        .catch(err => {
          console.warn(err)
          alert('Ошибка при получении статьи')
        })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  )

  if (!localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant='outlined' size='large'>
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type='file' onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant='contained' color='error' onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img
            className={styles.image}
            src={process.env.REACT_APP_API_URL + imageUrl}
            alt='uploadsed'
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Заголовок статьи...'
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant='standard'
        placeholder='Тэги'
        value={tags}
        onChange={e => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size='large' variant='contained'>
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href='/'>
          <Button size='large'>Отмена</Button>
        </a>
      </div>
    </Paper>
  )
}
