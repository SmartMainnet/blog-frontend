import React from 'react'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import styles from './AddComment.module.scss'

export const Index = () => {
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src='https://static.tildacdn.com/tild3266-3839-4665-a533-623166323531/no-profile.png'
        />
        <div className={styles.form}>
          <TextField
            label='Написать комментарий'
            variant='outlined'
            maxRows={10}
            multiline
            fullWidth
          />
          <Button variant='contained'>Отправить</Button>
        </div>
      </div>
    </>
  )
}
